import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { fastify as Fastify, FastifyServerOptions } from "fastify";
import { activitiesRoute } from "./routes/activities";

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

  fastify.register(activitiesRoute, { prefix: "/v1/activities" });
  return fastify;
}
