import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import Type from "typebox";

const Review = Type.Object({
  id: Type.Integer(),
  content: Type.String(),
});

export const reviewsRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "/v1/reviews",
    {
      schema: {
        tags: ["Reviews"],
        response: {
          200: Type.Object({
            data: Type.Array(Review),
          }),
        },
      },
    },
    async () => {
      return {
        data: [
          {
            id: 1,
            content: "Content 1",
          },
          {
            id: 2,
            content: "Content 2",
          },
        ],
      };
    },
  );

  fastify.post(
    "/v1/reviews",
    {
      schema: {
        tags: ["Reviews"],
        body: Type.Object({
          content: Type.String(),
        }),
        response: {
          200: Review,
        },
      },
    },
    async (request) => {
      return {
        id: 1,
        content: request.body.content,
      };
    },
  );

  fastify.get(
    "/v1/reviews/:id",
    {
      schema: {
        tags: ["Reviews"],
        params: Type.Object({
          id: Type.Integer(),
        }),
        response: {
          200: Review,
        },
      },
    },
    async (request) => {
      return {
        id: request.params.id,
        content: `Content ${request.params.id}`,
      };
    },
  );

  fastify.put(
    "/v1/reviews/:id",
    {
      schema: {
        tags: ["Reviews"],
        params: Type.Object({
          id: Type.Integer(),
        }),
        body: Type.Object({
          content: Type.String(),
        }),
        response: {
          200: Review,
        },
      },
    },
    async (request) => {
      return {
        id: request.params.id,
        content: request.body.content,
      };
    },
  );

  fastify.delete(
    "/v1/reviews/:id",
    {
      schema: {
        tags: ["Reviews"],
        params: Type.Object({
          id: Type.Integer(),
        }),
        response: {
          204: Type.Null(),
        },
      },
    },
    async (_request, reply) => {
      reply.status(204);
    },
  );
};
