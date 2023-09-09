// TODO Make automatic test


import supertest from "supertest";
import { db } from "../src/app/database";
import { app } from "../src/app/server";
describe("POST /api/v1/hero", () => {
  afterAll(async () => {
    await db.user.deleteMany({ where: { username: "test" } });
  });
  process.env.REGISTER_ENABLED = "true";
  process.env.AUTH_ENABLED = "true";

  it("should register new user", async () => {
    const result = await supertest(app).post("/api/v1/auth/register").send({
      name: "testing",
      username: "test",
      email: "test@test.com",
      password: "rahasia",
    });
    process.env.TOKEN = result.body.token;
    process.env.REFRESHTOKEN = result.body.refreshToken;
    expect(result.body.refreshToken).toBeDefined;
    expect(result.status).toBe(200);
  });
});
