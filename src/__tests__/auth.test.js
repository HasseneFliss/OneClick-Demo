const request = require("supertest");
const app = require("../index");

describe("Auth API", () => {
  test("POST /api/auth/register - success", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "test@example.com", password: "password123" });
    expect(res.status).toBe(201);
  });

  test("POST /api/auth/register - short password", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "test2@example.com", password: "short" });
    expect(res.status).toBe(400);
  });

  test("POST /api/auth/login - invalid", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "wrong@example.com", password: "password" });
    expect(res.status).toBe(401);
  });
});