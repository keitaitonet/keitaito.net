import { createServer } from "./create-server";
import { v7 as uuid } from "uuid";

async function main() {
  const server = await createServer({
    logger: true,
    genReqId() {
      return uuid();
    },
  });

  server.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
  });
}

main();
