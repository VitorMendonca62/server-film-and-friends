import app from "../../app";
import request from "supertest";
import { deleteAllData } from "../../utils/general";

const tokenReturn = { token: "" };
describe("post /auth/login", () => {
  const user = {
    name: "teste-user",
    username: "teste-user-test",
    password: "teste1234",
    email: "test-user-test0@test.com",
  };
  beforeAll(async () => {
    await request(app).post("/users").send(user);
  });

  it("senha curto", async () => {
    const loginData = {
      email: "test-user-test2@test.com",
      password: "abcde",
    };

    const response = await request(app).post("/auth/login").send(loginData);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.msg).toBe("A senha é curta demais!");
    expect(response.body.type).toBe("password");
  });

  it("não tem senha", async () => {
    const loginData = {
      email: "test-user-test1@test.com",
      password: undefined,
    };

    const response = await request(app).post("/auth/login").send(loginData);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.msg).toBe("Senha é obrigatória");
    expect(response.body.type).toBe("password");
  });
  it("sem email", async () => {
    const loginData = {
      email: undefined,
      password: "123456",
    };

    const response = await request(app).post("/auth/login").send(loginData);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.msg).toBe("Email é obrigatório");
    expect(response.body.type).toBe("email");
  });
  it("sem email", async () => {
    const loginData = {
      email: "test.com",
      password: "123456",
    };

    const response = await request(app).post("/auth/login").send(loginData);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.msg).toBe("Email inválido");
    expect(response.body.type).toBe("email");
  });

  it("usuario nao existe", async () => {
    const loginData = {
      email: "test@gmail.com",
      password: "123456",
    };

    const response = await request(app).post("/auth/login").send(loginData);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe(true);
    expect(response.body.msg).toBe("Não conseguimos encontrar!");
    expect(Object.values(response.body.data).length).toBe(0);
  });

  it("agora vai", async () => {
    const loginData = {
      password: "teste1234",
      email: "test-user-test0@test.com",
    };

    const response = await request(app).post("/auth/login").send(loginData);

    tokenReturn.token = response.headers.authorization;
    const { username, auth, msg, error, token } = response.body;

    expect(response.statusCode).toBe(201);
    expect(username).toBe(user.username);
    expect(auth).toBe(true);
    expect(msg).toBe("Usuário logado com sucesso!");
    expect(error).toBe(false);
    expect(typeof token === "string").toBe(true);
  });

  it("senha errada vai", async () => {
    const loginData = {
      password: "teste12345",
      email: "test-user-test0@test.com",
    };

    const response = await request(app).post("/auth/login").send(loginData);

    const { username, auth, msg, error, token } = response.body;

    expect(response.statusCode).toBe(400);
    expect(username).toBe(user.username);
    expect(auth).toBe(false);
    expect(msg).toBe("Usuário ou senha estão incorretos. Tente novamenete");
    expect(error).toBe(true);
    expect(token).toBe(undefined);
    expect(response.headers.authorization).toBe(undefined);
  });
});

deleteAllData();
export default tokenReturn;
