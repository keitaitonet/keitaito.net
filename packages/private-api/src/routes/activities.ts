import {
  type FastifyPluginAsyncTypebox,
  Type,
} from "@fastify/type-provider-typebox";
import { activitiesRepository } from "../repositories/activities";

const Activity = Type.Object({
  id: Type.Integer(),
  title: Type.String(),
  description: Type.String(),
  date: Type.String({ format: "date" }),
  created_at: Type.String(),
  updated_at: Type.String(),
});

const ActivityInput = Type.Object({
  title: Type.String(),
  description: Type.String(),
  date: Type.String({ format: "date" }),
});

const ErrorResponse = Type.Object({
  statusCode: Type.Integer(),
  error: Type.String(),
  message: Type.String(),
});

export const activitiesRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  const repo = activitiesRepository(fastify.rds);

  fastify.get(
    "/",
    {
      schema: {
        tags: ["Activities"],
        response: {
          200: Type.Object({
            list: Type.Array(Activity),
          }),
          503: ErrorResponse,
        },
      },
    },
    async () => {
      const list = await repo.list();
      return { list };
    },
  );

  fastify.post(
    "/",
    {
      schema: {
        tags: ["Activities"],
        body: ActivityInput,
        response: {
          201: Activity,
          503: ErrorResponse,
        },
      },
    },
    async (request, reply) => {
      reply.status(201);
      return repo.create(request.body);
    },
  );

  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["Activities"],
        params: Type.Object({
          id: Type.Integer(),
        }),
        response: {
          200: Activity,
          404: ErrorResponse,
          503: ErrorResponse,
        },
      },
    },
    async (request) => {
      const activity = await repo.get(request.params.id);
      if (!activity) {
        throw fastify.httpErrors.notFound();
      }
      return activity;
    },
  );

  fastify.put(
    "/:id",
    {
      schema: {
        tags: ["Activities"],
        params: Type.Object({
          id: Type.Integer(),
        }),
        body: ActivityInput,
        response: {
          200: Activity,
          404: ErrorResponse,
          503: ErrorResponse,
        },
      },
    },
    async (request) => {
      const activity = await repo.update(request.params.id, request.body);
      if (!activity) {
        throw fastify.httpErrors.notFound();
      }
      return activity;
    },
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        tags: ["Activities"],
        params: Type.Object({
          id: Type.Integer(),
        }),
        response: {
          204: Type.Null(),
          503: ErrorResponse,
        },
      },
    },
    async (request, reply) => {
      await repo.remove(request.params.id);
      reply.status(204);
      return null;
    },
  );
};
