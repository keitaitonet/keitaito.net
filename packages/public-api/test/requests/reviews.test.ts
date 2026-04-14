import { describe, expect, it } from "vitest";
import { createServer } from "../../src/create-server";

describe("GET /reviews", () => {
  it("should return a list of reviews", async () => {
    const server = createServer();
    const response = await server.inject({
      method: "GET",
      url: "/v1/reviews",
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toEqual({
      data: [
        {
          id: 1,
          content: "Content 1",
        },
        {
          id: 2,
          content: "Content 2",
        },
      ],
    });
  });
});

describe("POST /reviews", () => {
  it("should create a new review", async () => {
    const server = createServer();
    const response = await server.inject({
      method: "POST",
      url: "/v1/reviews",
      payload: {
        content: "New Review",
      },
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toEqual({
      id: 1,
      content: "New Review",
    });
  });
});

describe("GET /reviews/:id", () => {
  it("should return a review", async () => {
    const server = createServer();
    const response = await server.inject({
      method: "GET",
      url: "/v1/reviews/1",
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toEqual({
      id: 1,
      content: "Content 1",
    });
  });
});

describe("PUT /reviews/:id", () => {
  it("should update a review", async () => {
    const server = createServer();
    const response = await server.inject({
      method: "PUT",
      url: "/v1/reviews/1",
      payload: {
        content: "Updated Review",
      },
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toEqual({
      id: 1,
      content: "Updated Review",
    });
  });
});

describe("DELETE /reviews/:id", () => {
  it("should delete a review", async () => {
    const server = createServer();
    const response = await server.inject({
      method: "DELETE",
      url: "/v1/reviews/1",
    });
    expect(response.statusCode).toBe(204);
  });
});
