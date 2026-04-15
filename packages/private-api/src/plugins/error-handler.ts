import { fastifyPlugin } from "fastify-plugin";
import { RdsResumingError } from "../lib/rds-retry";

export default fastifyPlugin(async (fastify) => {
  fastify.setErrorHandler((err, req, reply) => {
    if (err instanceof RdsResumingError) {
      req.log.warn({ err }, "RDS resuming");
      return reply.serviceUnavailable(
        "Database is waking up. Please retry shortly.",
      );
    }
    return reply.send(err);
  });
});
