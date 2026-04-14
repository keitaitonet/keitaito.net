import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      AWS_REGION: "ap-northeast-1",
      RDS_RESOURCE_ARN: "arn:aws:rds:test",
      RDS_SECRET_ARN: "arn:aws:secretsmanager:test",
    },
    projects: [
      {
        test: {
          name: "Requests",
          include: ["test/requests/**"],
          mockReset: true,
        },
      },
      {
        test: {
          name: "Unit",
          include: ["test/**", "!test/requests/**"],
        },
      },
    ],
  },
});
