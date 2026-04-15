import { ExecuteStatementCommand } from "@aws-sdk/client-rds-data";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  executeStatementWithRetry,
  RdsResumingError,
} from "../../src/lib/rds-retry";

function createClient() {
  const send = vi.fn();
  return { client: { send }, send };
}

function resumingError() {
  const error = new Error(
    "The Aurora DB instance db-XXX is resuming after being auto-paused. Please wait a few seconds and try again.",
  );
  error.name = "DatabaseResumingException";
  return error;
}

const input = {
  resourceArn: "arn:rds",
  secretArn: "arn:secret",
  sql: "SELECT 1",
};

describe("executeStatementWithRetry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("初回成功時はそのまま結果を返す", async () => {
    const { client, send } = createClient();
    send.mockResolvedValueOnce({ formattedRecords: "[]" });

    const result = await executeStatementWithRetry(client, input);

    expect(result).toEqual({ formattedRecords: "[]" });
    expect(send).toHaveBeenCalledExactlyOnceWith(
      expect.any(ExecuteStatementCommand),
    );
  });

  it("DatabaseResumingException を name で検知してリトライする", async () => {
    const { client, send } = createClient();
    send
      .mockRejectedValueOnce(resumingError())
      .mockRejectedValueOnce(resumingError())
      .mockResolvedValueOnce({ formattedRecords: "[]" });

    const promise = executeStatementWithRetry(client, input);
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toEqual({ formattedRecords: "[]" });
    expect(send).toHaveBeenCalledTimes(3);
  });

  it("name が異なってもメッセージで検知する (フォールバック)", async () => {
    const { client, send } = createClient();
    const error = new Error(
      "The Aurora DB instance db-XXX is resuming after being auto-paused. ...",
    );
    error.name = "BadRequestException";
    send
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce({ formattedRecords: "[]" });

    const promise = executeStatementWithRetry(client, input);
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toEqual({ formattedRecords: "[]" });
    expect(send).toHaveBeenCalledTimes(2);
  });

  it("リトライ対象外のエラーは即時に再 throw する", async () => {
    const { client, send } = createClient();
    const error = new Error("syntax error");
    error.name = "BadRequestException";
    send.mockRejectedValueOnce(error);

    await expect(executeStatementWithRetry(client, input)).rejects.toBe(error);
    expect(send).toHaveBeenCalledOnce();
  });

  it("リトライ上限に達したら RdsResumingError を throw する", async () => {
    const { client, send } = createClient();
    const cause = resumingError();
    send.mockRejectedValue(cause);

    const assertion = expect(
      executeStatementWithRetry(client, input),
    ).rejects.toSatisfy(
      (err) => err instanceof RdsResumingError && err.cause === cause,
    );
    await vi.runAllTimersAsync();
    await assertion;
    expect(send).toHaveBeenCalledTimes(5);
  });

  it("指数バックオフで待つ", async () => {
    const { client, send } = createClient();
    send
      .mockRejectedValueOnce(resumingError())
      .mockRejectedValueOnce(resumingError())
      .mockRejectedValueOnce(resumingError())
      .mockResolvedValueOnce({ formattedRecords: "[]" });

    const promise = executeStatementWithRetry(client, input);

    // 1回目失敗 → 1秒待ち (jitter 最大 +250ms)
    await vi.advanceTimersByTimeAsync(1250);
    expect(send).toHaveBeenCalledTimes(2);

    // 2回目失敗 → 2秒待ち
    await vi.advanceTimersByTimeAsync(2250);
    expect(send).toHaveBeenCalledTimes(3);

    // 3回目失敗 → 4秒待ち
    await vi.advanceTimersByTimeAsync(4250);
    expect(send).toHaveBeenCalledTimes(4);

    await expect(promise).resolves.toEqual({ formattedRecords: "[]" });
  });
});
