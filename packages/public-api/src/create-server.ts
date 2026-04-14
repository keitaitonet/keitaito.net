import { RDSDataClient } from "@aws-sdk/client-rds-data";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { fastify as Fastify, FastifyServerOptions } from "fastify";
import { activitiesRoute } from "./routes/activities";
import fastifyEnv from "@fastify/env";

const envSchema = {
  type: "object",
  required: ["AWS_REGION", "RDS_RESOURCE_ARN", "RDS_SECRET_ARN"],
  properties: {
    AWS_REGION: { type: "string" },
    RDS_RESOURCE_ARN: { type: "string" },
    RDS_SECRET_ARN: { type: "string" },
  },
} as const;

declare module "fastify" {
  interface FastifyInstance {
    config: {
      AWS_REGION: string;
      RDS_RESOURCE_ARN: string;
      RDS_SECRET_ARN: string;
    };
    rds: {
      client: RDSDataClient;
      resourceArn: string;
      secretArn: string;
    };
  }
}

export async function createServer(options: FastifyServerOptions = {}) {
  const fastify = Fastify(options).withTypeProvider<TypeBoxTypeProvider>();

  await fastify.register(fastifyEnv, { schema: envSchema });

  fastify.decorate("rds", {
    client: new RDSDataClient({ region: fastify.config.AWS_REGION }),
    resourceArn: fastify.config.RDS_RESOURCE_ARN,
    secretArn: fastify.config.RDS_SECRET_ARN,
  });

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
