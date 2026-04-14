import { createServer } from "./create-server";

const server = await createServer({
  logger: true,
});

server.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
