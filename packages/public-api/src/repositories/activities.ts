import {
  ExecuteStatementCommand,
  SqlParameter,
} from "@aws-sdk/client-rds-data";
import { rdsClient, rdsConfig } from "../db/client";

export type Model = {
  id: number;
  title: string;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
};

export type Input = {
  title: string;
  description: string;
  date: string;
};

const ACTIVITY_COLUMNS = "id, title, description, date, created_at, updated_at";

async function query<T>(
  sql: string,
  parameters?: SqlParameter[],
): Promise<T[]> {
  const command = new ExecuteStatementCommand({
    resourceArn: rdsConfig.resourceArn,
    secretArn: rdsConfig.secretArn,
    sql,
    parameters,
    formatRecordsAs: "JSON",
  });
  const { formattedRecords } = await rdsClient.send(command);
  return JSON.parse(formattedRecords as string) as T[];
}

async function execute(
  sql: string,
  parameters?: SqlParameter[],
): Promise<void> {
  const command = new ExecuteStatementCommand({
    resourceArn: rdsConfig.resourceArn,
    secretArn: rdsConfig.secretArn,
    sql,
    parameters,
  });
  await rdsClient.send(command);
}

export async function list(): Promise<Model[]> {
  return query<Model>(`SELECT ${ACTIVITY_COLUMNS} FROM activities`);
}

export async function get(id: number): Promise<Model | null> {
  const rows = await query<Model>(
    `SELECT ${ACTIVITY_COLUMNS} FROM activities WHERE id = :id`,
    [{ name: "id", value: { longValue: id } }],
  );
  return rows[0] ?? null;
}

export async function create(input: Input): Promise<Model> {
  const rows = await query<Model>(
    `INSERT INTO activities (title, description, date)
     VALUES (:title, :description, :date)
     RETURNING ${ACTIVITY_COLUMNS}`,
    [
      { name: "title", value: { stringValue: input.title } },
      { name: "description", value: { stringValue: input.description } },
      { name: "date", value: { stringValue: input.date }, typeHint: "DATE" },
    ],
  );
  return rows[0];
}

export async function update(id: number, input: Input): Promise<Model | null> {
  const rows = await query<Model>(
    `UPDATE activities
     SET title = :title, description = :description, date = :date
     WHERE id = :id
     RETURNING ${ACTIVITY_COLUMNS}`,
    [
      { name: "title", value: { stringValue: input.title } },
      { name: "description", value: { stringValue: input.description } },
      { name: "date", value: { stringValue: input.date }, typeHint: "DATE" },
      { name: "id", value: { longValue: id } },
    ],
  );
  return rows[0] ?? null;
}

export async function remove(id: number): Promise<void> {
  await execute("DELETE FROM activities WHERE id = :id", [
    { name: "id", value: { longValue: id } },
  ]);
}
