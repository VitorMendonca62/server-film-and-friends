// TUdo ok

// Libraries
import app from "../../app";
import request from "supertest";

// Utils
import { deleteAllData } from "../../utils/tests/general";

describe("post users/auth/login", () => {
  const dataDelete: string[] = [];

  afterAll(() => {
    deleteAllData("users", "email", dataDelete);
  });

  const user = {
    name: "teste-user",
    username: "teste-user-test",
    password: "teste1234",
    email: "test-user-test0@test.com",
  };

  beforeAll(async () => {
    await request(app).post("/users").send(user);
    dataDelete.push(`'${user.email}'`);
  });

  it("senha errada vai", async () => {
    const loginData = {
      password: "teste12345",
      email: "test-user-test0@test.com",
    };

    const response = await request(app).post("/users/auth/login").send(loginData);

    const { username, auth, msg, token } = response.body;

    expect(msg).toBe("Usuário ou senha estão incorretos. Tente novamenete");
    expect(response.statusCode).toBe(400);
    expect(username).toBe(user.username);
    expect(auth).toBe(false);
    expect(token).toBe(undefined);
    expect(response.headers.authorization).toBe(undefined);
  });

  it("deve fazer a autenticacao", async () => {
    const loginData = {
      password: "teste1234",
      email: "test-user-test0@test.com",
    };

    const response = await request(app).post("/users/auth/login").send(loginData);

    const { username, auth, msg, token } = response.body;

    expect(msg).toBe("Usuário logado com sucesso!");
    expect(response.statusCode).toBe(201);
    expect(username).toBe(user.username);
    expect(auth).toBe(true);
    expect(typeof token === "string").toBe(true);
  });
});
