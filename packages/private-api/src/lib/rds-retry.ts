import {
  ExecuteStatementCommand,
  type ExecuteStatementCommandInput,
  type ExecuteStatementCommandOutput,
  type RDSDataClient,
} from "@aws-sdk/client-rds-data";

const RETRY_DELAYS_MS = [1000, 2000, 4000, 8000];

type RdsClient = Pick<RDSDataClient, "send">;

export class RdsResumingError extends Error {
  override readonly name = "RdsResumingError";
  constructor(cause: unknown) {
    super("RDS cluster is resuming from auto-pause", { cause });
  }
}

export async function executeStatementWithRetry(
  client: RdsClient,
  input: ExecuteStatementCommandInput,
): Promise<ExecuteStatementCommandOutput> {
  let lastError: unknown;
  for (let attempt = 0; ; attempt++) {
    try {
      return await client.send(new ExecuteStatementCommand(input));
    } catch (error) {
      if (!isResumingError(error)) {
        throw error;
      }
      lastError = error;
      const delay = RETRY_DELAYS_MS[attempt];
      if (delay === undefined) {
        break;
      }
      await sleep(delay + jitter());
    }
  }
  throw new RdsResumingError(lastError);
}

function isResumingError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const { name, message } = error as { name?: string; message?: string };
  if (name === "DatabaseResumingException") return true;
  if (typeof message !== "string") return false;
  return (
    message.includes("is resuming after being auto-paused") ||
    message.includes("Wait a few seconds and try again")
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jitter(): number {
  return Math.floor(Math.random() * 250);
}
