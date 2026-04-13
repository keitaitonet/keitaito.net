import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { fastify as Fastify } from "fastify";
import { reviewsRoute } from "./routes/v1/reviews";

const fastify = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

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

fastify.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
