import { describe, expect, it, vi } from "vitest";
import { createServer } from "../../src/create-server";
import { activitiesRepository } from "../../src/repositories/activities";

type Repo = ReturnType<typeof activitiesRepository>;

const repo = vi.hoisted(() => ({
  list: vi.fn<Repo["list"]>(),
  get: vi.fn<Repo["get"]>(),
  create: vi.fn<Repo["create"]>(),
  update: vi.fn<Repo["update"]>(),
  remove: vi.fn<Repo["remove"]>(),
}));

vi.mock("../../src/repositories/activities", () => ({
  activitiesRepository: () => repo,
}));

describe("GET /v1/activities", () => {
  it("一覧を取得できる", async () => {
    repo.list.mockResolvedValue([
      {
        id: 1,
        title: "title",
        description: "description",
        date: "2026-04-14",
        created_at: "2026-04-14T00:00:00Z",
        updated_at: "2026-04-14T00:00:00Z",
      },
      {
        id: 2,
        title: "title2",
        description: "description2",
        date: "2026-04-15",
        created_at: "2026-04-15T00:00:00Z",
        updated_at: "2026-04-15T00:00:00Z",
      },
    ]);

    const server = await createServer();
    const response = await server.inject({
      method: "GET",
      url: "/v1/activities",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      list: [
        {
          id: 1,
          title: "title",
          description: "description",
          date: "2026-04-14",
          created_at: "2026-04-14T00:00:00Z",
          updated_at: "2026-04-14T00:00:00Z",
        },
        {
          id: 2,
          title: "title2",
          description: "description2",
          date: "2026-04-15",
          created_at: "2026-04-15T00:00:00Z",
          updated_at: "2026-04-15T00:00:00Z",
        },
      ],
    });
    expect(repo.list).toHaveBeenCalledOnce();
  });

  it("0件のとき空配列を返す", async () => {
    repo.list.mockResolvedValue([]);

    const server = await createServer();
    const response = await server.inject({
      method: "GET",
      url: "/v1/activities",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ list: [] });
  });
});

describe("POST /v1/activities", () => {
  it("作成できる", async () => {
    repo.create.mockResolvedValue({
      id: 1,
      title: "title",
      description: "description",
      date: "2026-04-14",
      created_at: "2026-04-14T00:00:00Z",
      updated_at: "2026-04-14T00:00:00Z",
    });

    const server = await createServer();
    const response = await server.inject({
      method: "POST",
      url: "/v1/activities",
      payload: {
        title: "title",
        description: "description",
        date: "2026-04-14",
      },
    });

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toEqual({
      id: 1,
      title: "title",
      description: "description",
      date: "2026-04-14",
      created_at: "2026-04-14T00:00:00Z",
      updated_at: "2026-04-14T00:00:00Z",
    });
    expect(repo.create).toHaveBeenCalledExactlyOnceWith({
      title: "title",
      description: "description",
      date: "2026-04-14",
    });
  });

  it("titleがないとき400を返す", async () => {
    const server = await createServer();
    const response = await server.inject({
      method: "POST",
      url: "/v1/activities",
      payload: {
        description: "description",
        date: "2026-04-14",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("dateが誤った日付形式のとき400を返す", async () => {
    const server = await createServer();
    const response = await server.inject({
      method: "POST",
      url: "/v1/activities",
      payload: {
        title: "title",
        description: "description",
        date: "2026/04/14",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(repo.create).not.toHaveBeenCalled();
  });
});

describe("GET /v1/activities/:id", () => {
  it("取得できる", async () => {
    repo.get.mockResolvedValue({
      id: 1,
      title: "title",
      description: "description",
      date: "2026-04-14",
      created_at: "2026-04-14T00:00:00Z",
      updated_at: "2026-04-14T00:00:00Z",
    });

    const server = await createServer();
    const response = await server.inject({
      method: "GET",
      url: "/v1/activities/1",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      id: 1,
      title: "title",
      description: "description",
      date: "2026-04-14",
      created_at: "2026-04-14T00:00:00Z",
      updated_at: "2026-04-14T00:00:00Z",
    });
  });

  it("存在しないとき404を返す", async () => {
    repo.get.mockResolvedValue(null);

    const server = await createServer();
    const response = await server.inject({
      method: "GET",
      url: "/v1/activities/999",
    });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toEqual({
      statusCode: 404,
      error: "Not Found",
      message: "Not Found",
    });
  });

  it("idが数値でないとき400を返す", async () => {
    const server = await createServer();
    const response = await server.inject({
      method: "GET",
      url: "/v1/activities/abc",
    });

    expect(response.statusCode).toBe(400);
    expect(repo.get).not.toHaveBeenCalled();
  });

  it("idが整数でないとき400を返す", async () => {
    const server = await createServer();
    const response = await server.inject({
      method: "GET",
      url: "/v1/activities/1.5",
    });

    expect(response.statusCode).toBe(400);
    expect(repo.get).not.toHaveBeenCalled();
  });
});

describe("PUT /v1/activities/:id", () => {
  it("更新できる", async () => {
    repo.update.mockResolvedValue({
      id: 1,
      title: "updated title",
      description: "updated description",
      date: "2026-04-15",
      created_at: "2026-04-14T00:00:00Z",
      updated_at: "2026-04-15T00:00:00Z",
    });

    const server = await createServer();
    const response = await server.inject({
      method: "PUT",
      url: "/v1/activities/1",
      payload: {
        title: "updated title",
        description: "updated description",
        date: "2026-04-15",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      id: 1,
      title: "updated title",
      description: "updated description",
      date: "2026-04-15",
      created_at: "2026-04-14T00:00:00Z",
      updated_at: "2026-04-15T00:00:00Z",
    });
    expect(repo.update).toHaveBeenCalledExactlyOnceWith(1, {
      title: "updated title",
      description: "updated description",
      date: "2026-04-15",
    });
  });

  it("存在しないとき404を返す", async () => {
    repo.update.mockResolvedValue(null);

    const server = await createServer();
    const response = await server.inject({
      method: "PUT",
      url: "/v1/activities/999",
      payload: {
        title: "updated title",
        description: "updated description",
        date: "2026-04-15",
      },
    });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toEqual({
      statusCode: 404,
      error: "Not Found",
      message: "Not Found",
    });
    expect(repo.update).toHaveBeenCalledExactlyOnceWith(999, {
      title: "updated title",
      description: "updated description",
      date: "2026-04-15",
    });
  });

  it("idが数値でないとき400を返す", async () => {
    const server = await createServer();
    const response = await server.inject({
      method: "PUT",
      url: "/v1/activities/abc",
      payload: {
        title: "updated title",
        description: "updated description",
        date: "2026-04-15",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(repo.update).not.toHaveBeenCalled();
  });

  it("titleがないとき400を返す", async () => {
    const server = await createServer();
    const response = await server.inject({
      method: "PUT",
      url: "/v1/activities/1",
      payload: {
        description: "updated description",
        date: "2026-04-15",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(repo.update).not.toHaveBeenCalled();
  });
});

describe("DELETE /v1/activities/:id", () => {
  it("削除できる", async () => {
    repo.remove.mockResolvedValue(undefined);

    const server = await createServer();
    const response = await server.inject({
      method: "DELETE",
      url: "/v1/activities/1",
    });

    expect(response.statusCode).toBe(204);
    expect(repo.remove).toHaveBeenCalledExactlyOnceWith(1);
  });

  it("存在しないときも204を返す", async () => {
    repo.remove.mockResolvedValue(undefined);

    const server = await createServer();
    const response = await server.inject({
      method: "DELETE",
      url: "/v1/activities/999",
    });

    expect(response.statusCode).toBe(204);
    expect(repo.remove).toHaveBeenCalledExactlyOnceWith(999);
  });

  it("idが数値でないとき400を返す", async () => {
    const server = await createServer();
    const response = await server.inject({
      method: "DELETE",
      url: "/v1/activities/abc",
    });

    expect(response.statusCode).toBe(400);
    expect(repo.remove).not.toHaveBeenCalled();
  });
});
