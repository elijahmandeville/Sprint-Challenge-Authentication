const supertest = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");

beforeEach(async () => {
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe("users integration tests", () => {
  it("POST /api/auth/register", async () => {
    const user = { username: "bob", password: "bigPassword" };
    const res = await supertest(server).post("/api/auth/register").send(user);

    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe("bob");
    expect(res.type).toBe("application/json");
  });

  it("POST /api/auth/login", async () => {
    const user = { username: "userFour", password: "passwordFour" };

    const register = await supertest(server)
      .post("/api/auth/register")
      .send(user);
    expect(register.statusCode).toBe(201);

    const res = await supertest(server).post("/api/auth/login").send(user);

    // console.log(res);
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe("application/json");
  });
});

describe("jokes router auth", () => {
  it("jokes", async () => {
    const res = await supertest(server).get("/api/jokes");

    expect(res.body.message).toMatch(/not authorized/i);
  });
});
