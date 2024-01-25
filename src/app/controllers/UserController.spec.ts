import app from "../../app";
import request from "supertest";
import { deleteAllData } from "../../utils/general";

describe("get /users", () => {
  it("Listando usuarios", async () => {
    const response = await request(app).get("/users");

    expect(response.statusCode).toBe(200);
  });
});

describe("post /users", () => {
  it("Criando usuario", async () => {
    const user: IUserSchema = {
      name: "test-post-user",
      username: "test-post-user",
      password: "teste1234",
      email: "test-post-user@test.com",
    };

    const response = await request(app).post("/users").send(user);
    
    const {error, msg, data} = response.body
    const {name, username, email} = response.body.data

    expect(response.statusCode).toBe(201);
    expect(error).toBe(false);
    expect(msg).toBe("Usuário cadastrado com sucesso!");

    expect(name).toBe(user.name);
    expect(username).toBe(user.username);
    expect(email).toBe(user.email);

    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("passwordHash");
    expect(data).toHaveProperty("role");
  });

  it("Criando usuario sem nome", async () => {
    const response = await request(app).post("/users").send({
      name: undefined,
      username: "test-post-user-without-name",
      password: "teste1234",
      email: "test-post-user-without-name@test.com",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.msg).toBe("Nome é obrigatório");
    expect(response.body.type).toBe("name");
  });

  it("Criando usuario sem username", async () => {
    const response = await request(app).post("/users").send({
      name: "test-post-user-without-username",
      username: undefined,
      password: "teste1234",
      email: "test-post-user-without-username@test.com",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.msg).toBe("Apelido é obrigatório");
    expect(response.body.type).toBe("username");
  });

  it("Criando usuario sem email", async () => {
    const response = await request(app).post("/users").send({
      name: "test-post-user-without-email",
      username: "test-post-user-without-email",
      password: "teste1234",
      email: undefined,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.msg).toBe("Email é obrigatório");
    expect(response.body.type).toBe("email");
  });

  it("Criando usuario com email invalido", async () => {
    const response = await request(app).post("/users").send({
      name: "test-post-user-invalid-email",
      username: "test-post-user-invalid-email",
      password: "teste1234",
      email: "testemailinvalid.com",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.msg).toBe("Email inválido");
    expect(response.body.type).toBe("email");
  });

  it("Criando usuario sem senha", async () => {
    const response = await request(app).post("/users").send({
      name: "test-post-user-without-password",
      username: "test-post-user-without-password",
      password: undefined,
      email: "test-post-user-without-password@test.com",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.msg).toBe("Senha é obrigatória");
    expect(response.body.type).toBe("password");
  });

  it("Criando usuario com senha curta", async () => {
    const response = await request(app).post("/users").send({
      name: "test-post-user-short-password",
      username: "test-post-user-short-password",
      password: "test",
      email: "test-post-user-short-password@test.com",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.msg).toBe("A senha é curta demais!");
    expect(response.body.type).toBe("password");
  });

  it("Criando usuario com username já criado", async () => {
    await request(app).post("/users").send({
      name: "test-post-user-username-in-use",
      username: "test-post-user-username-in-use",
      password: "test1234",
      email: "test5178d@test.com",
    });
    const response = await request(app).post("/users").send({
      name: "test-post-user-username-in-use",
      username: "test-post-user-username-in-use",
      password: "test1234",
      email: "test1234567@test.com",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.msg).toBe(
      "Apelido já cadastrado, tente utilizar outro apelido!",
    );
    expect(Object.values(response.body.data).length).toBe(0);
  });

  it("Criando usuario com email já criado", async () => {
    await request(app).post("/users").send({
      name: "test-post-user-email-in-use",
      username: "test-post-user-email-in-use",
      password: "test1234",
      email: "email-in-use@test.com",
    });
    const response = await request(app).post("/users").send({
      name: "test-post-user-email-in-use",
      username: "test-post-user-in-use",
      password: "test1234",
      email: "email-in-use@test.com",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.msg).toBe("Email já cadastrado, tente fazer login!");
    expect(Object.values(response.body.data).length).toBe(0);
  });
});

describe("get users/find", () => {
  const user = {
    name: "teste-user",
    username: "teste-user",
    password: "teste1234",
    email: "test-user-test@test.com",
  };

  beforeAll(async () => {
    await request(app).post("/users").send(user);
  });

  it("Procurando um usuario sem id e sem username", async () => {
    const response = await request(app).get("/users/find");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.msg).toBe("Algo deu errado!");
    expect(Object.values(response.body.data).length).toBe(0);
  });

  it("Procurando um usuario que não está no banco de dados", async () => {
    const response = await request(app).get(
      "/users/find?id=test&&username=test1",
    );

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe(true);
    expect(response.body.msg).toBe("Não conseguimos encontrar!");
    expect(Object.values(response.body.data).length).toBe(0);
  });

  it("Procurando um usuario por username", async () => {
    const response = await request(app).get(
      "/users/find?id=test&&username=teste-user",
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.msg).toBe("Usuário encontrado com sucesso!");
    expect(response.body.data).toBeInstanceOf(Object);
    expect(response.body.data.name).toBe(user.name);
    expect(response.body.data.username).toBe(user.username);
  });
});


deleteAllData()
