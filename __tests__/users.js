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
  it("Registering a user", async () => {
    const user = { username: "bob", password: "bigPassword" };
    const res = await supertest(server).post("/api/auth/register").send(user);

    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe("bob");
    expect(res.type).toBe("application/json");
  });

  it("Registering with duplicate username", async () => {
    const user = { username: "userOne", password: "passwordOne" };
    const res = await supertest(server).post("/api/auth/register").send(user);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/username is taken/i);
  });

  it("Logging in as an existing user", async () => {
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

  it("Logging in with incorrect password", async () => {
    const user = { username: "userFour", password: "passwordFour" };

    const register = await supertest(server)
      .post("/api/auth/register")
      .send(user);
    expect(register.statusCode).toBe(201);

    const wrongInfo = { username: "userFour", password: "passordFour" };

    const res = await supertest(server).post("/api/auth/login").send(wrongInfo);

    expect(res.statusCode).toBe(401);
    expect(res.type).toBe("application/json");
    expect(res.body.message).toMatch(/invalid credentials/i);
  });
});

it("Logging in with incorrect username and password", async () => {
  const user = { username: "userFour", password: "passwordFour" };

  const register = await supertest(server)
    .post("/api/auth/register")
    .send(user);
  expect(register.statusCode).toBe(201);

  const wrongInfo = { username: "userFouwr", password: "passordFour" };

  const res = await supertest(server).post("/api/auth/login").send(wrongInfo);

  expect(res.statusCode).toBe(401);
  expect(res.type).toBe("application/json");
  expect(res.body.message).toMatch(/login details invalid/i);
});

describe("jokes router auth", () => {
  it("jokes", async () => {
    const res = await supertest(server).get("/api/jokes");

    expect(res.body.message).toMatch(/not authorized/i);
  });
});
