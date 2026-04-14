import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { fastify as Fastify, FastifyServerOptions } from "fastify";
import { reviewsRoute } from "./routes/v1/reviews";

export function createServer(options: FastifyServerOptions = {}) {
  const fastify = Fastify(options).withTypeProvider<TypeBoxTypeProvider>();

  fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "keitaito.net Blog",
        version: "1.0.0",
      },
    },
  });
  fastify.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  fastify.register(reviewsRoute);
  return fastify;
}
