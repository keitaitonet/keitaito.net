import type { SqlParameter } from "@aws-sdk/client-rds-data";
import type { FastifyInstance } from "fastify";
import { executeStatementWithRetry } from "../lib/rds-retry";

type Rds = FastifyInstance["rds"];

export interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityInput {
  title: string;
  description: string;
  date: string;
}

const ACTIVITY_COLUMNS = "id, title, description, date, created_at, updated_at";

export function activitiesRepository(rds: Rds) {
  async function query<T>(
    sql: string,
    parameters?: SqlParameter[],
  ): Promise<T[]> {
    const { formattedRecords } = await executeStatementWithRetry(rds.client, {
      resourceArn: rds.resourceArn,
      secretArn: rds.secretArn,
      sql,
      parameters,
      formatRecordsAs: "JSON",
    });
    return JSON.parse(formattedRecords as string) as T[];
  }

  async function execute(
    sql: string,
    parameters?: SqlParameter[],
  ): Promise<void> {
    await executeStatementWithRetry(rds.client, {
      resourceArn: rds.resourceArn,
      secretArn: rds.secretArn,
      sql,
      parameters,
    });
  }

  return {
    async list(): Promise<Activity[]> {
      return query<Activity>(`SELECT ${ACTIVITY_COLUMNS} FROM activities`);
    },

    async get(id: number): Promise<Activity | null> {
      const rows = await query<Activity>(
        `SELECT ${ACTIVITY_COLUMNS} FROM activities WHERE id = :id`,
        [{ name: "id", value: { longValue: id } }],
      );
      return rows[0] ?? null;
    },

    async create(input: ActivityInput): Promise<Activity> {
      const rows = await query<Activity>(
        `INSERT INTO activities (title, description, date)
         VALUES (:title, :description, :date)
         RETURNING ${ACTIVITY_COLUMNS}`,
        [
          { name: "title", value: { stringValue: input.title } },
          { name: "description", value: { stringValue: input.description } },
          {
            name: "date",
            value: { stringValue: input.date },
            typeHint: "DATE",
          },
        ],
      );
      return rows[0] as Activity;
    },

    async update(id: number, input: ActivityInput): Promise<Activity | null> {
      const rows = await query<Activity>(
        `UPDATE activities
         SET title = :title, description = :description, date = :date
         WHERE id = :id
         RETURNING ${ACTIVITY_COLUMNS}`,
        [
          { name: "title", value: { stringValue: input.title } },
          { name: "description", value: { stringValue: input.description } },
          {
            name: "date",
            value: { stringValue: input.date },
            typeHint: "DATE",
          },
          { name: "id", value: { longValue: id } },
        ],
      );
      return rows[0] ?? null;
    },

    async remove(id: number): Promise<void> {
      await execute("DELETE FROM activities WHERE id = :id", [
        { name: "id", value: { longValue: id } },
      ]);
    },
  };
}
