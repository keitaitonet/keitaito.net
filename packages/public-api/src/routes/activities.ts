import {
  FastifyPluginAsyncTypebox,
  Type,
} from "@fastify/type-provider-typebox";
import * as repo from "../repositories/activities";

const Model = Type.Object({
  id: Type.Integer(),
  title: Type.String(),
  description: Type.String(),
  date: Type.String({ format: "date" }),
  created_at: Type.String(),
  updated_at: Type.String(),
});

const Input = Type.Object({
  title: Type.String(),
  description: Type.String(),
  date: Type.String({ format: "date" }),
});

const NotFound = Type.Object({
  message: Type.String(),
});

export const activitiesRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["Activities"],
        response: {
          200: Type.Object({
            list: Type.Array(Model),
          }),
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
        body: Input,
        response: {
          201: Model,
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
          200: Model,
          404: NotFound,
        },
      },
    },
    async (request, reply) => {
      const activity = await repo.get(request.params.id);
      if (!activity) {
        reply.status(404);
        return { message: "Not found" };
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
        body: Input,
        response: {
          200: Model,
          404: NotFound,
        },
      },
    },
    async (request, reply) => {
      const activity = await repo.update(request.params.id, request.body);
      if (!activity) {
        reply.status(404);
        return { message: "Not found" };
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
