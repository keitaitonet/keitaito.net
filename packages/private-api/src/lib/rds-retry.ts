import {
  ExecuteStatementCommand,
  type ExecuteStatementCommandInput,
  type ExecuteStatementCommandOutput,
  type RDSDataClient,
} from "@aws-sdk/client-rds-data";

const RETRY_DELAYS_MS = [1000, 2000, 4000, 8000];

type RdsClient = Pick<RDSDataClient, "send">;

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
  throw toServiceUnavailable(lastError);
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

function toServiceUnavailable(cause: unknown): Error {
  const error = new Error(
    "Database is waking up. Please retry shortly.",
  ) as Error & {
    statusCode?: number;
  };
  error.statusCode = 503;
  error.cause = cause;
  return error;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jitter(): number {
  return Math.floor(Math.random() * 250);
}
