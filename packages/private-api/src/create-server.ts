import path from "node:path";
import { RDSDataClient } from "@aws-sdk/client-rds-data";
import fastifyEnv from "@fastify/env";
import fastifySensible from "@fastify/sensible";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { fastify as Fastify, type FastifyServerOptions } from "fastify";
import errorHandler from "./plugins/error-handler";
import { activitiesRoute } from "./routes/activities";

const envSchema = {
  type: "object",
  required: ["AWS_REGION", "RDS_RESOURCE_ARN", "RDS_SECRET_ARN"],
  properties: {
    AWS_REGION: { type: "string" },
    RDS_RESOURCE_ARN: { type: "string" },
    RDS_SECRET_ARN: { type: "string" },
  },
} as const;

export async function createServer(options: FastifyServerOptions = {}) {
  const fastify = Fastify(options).withTypeProvider<TypeBoxTypeProvider>();

  await fastify.register(fastifyEnv, { schema: envSchema });
  await fastify.register(fastifySensible);
  await fastify.register(errorHandler);

  fastify.decorate("rds", {
    client: new RDSDataClient({ region: fastify.config.AWS_REGION }),
    resourceArn: fastify.config.RDS_RESOURCE_ARN,
    secretArn: fastify.config.RDS_SECRET_ARN,
  });

  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "keitaito.net Blog",
        version: "1.0.0",
      },
    },
  });
  await fastify.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    baseDir: path.join(__dirname, "static"),
    uiConfig: {
      displayOperationId: true,
    },
  });

  await fastify.register(activitiesRoute, { prefix: "/v1/activities" });
  return fastify;
}
