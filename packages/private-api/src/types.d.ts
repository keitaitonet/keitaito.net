import type { RDSDataClient } from "@aws-sdk/client-rds-data";

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
