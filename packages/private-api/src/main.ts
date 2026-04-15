import closeWithGrace from "close-with-grace";
import { v7 as uuid } from "uuid";
import { createServer } from "./create-server";

async function main() {
  const server = await createServer({
    logger: true,
    genReqId: () => uuid(),
  });

  closeWithGrace({ delay: 500 }, async ({ err }) => {
    if (err) server.log.error({ err }, "shutdown error");
    await server.close();
  });

  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
