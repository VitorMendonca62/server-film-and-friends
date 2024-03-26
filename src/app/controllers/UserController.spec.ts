import app from "../../app";
import request from "supertest";
import { deleteAllData } from "../../utils/general";
import {
  verifyTokenAndID,
  verifyValidationsKeys,
  fetchLoginData,
} from "../../utils/tests";

const dataDelete: string[] = [];

describe("Test in /users", () => {
  afterAll(() => {
    deleteAllData(dataDelete);
  });

  describe("get /users", () => {
    it("Listando usuarios", async () => {
      const response = await request(app).get("/users");

      expect(response.body.msg).toBe("Aqui estão todos nossos usuários!");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("post /users", () => {
    const user: IUserSchema = {
      name: "test-post-user",
      username: "test-in-use",
      password: "teste1234",
      email: "test-in-use@test.com",
    };

    beforeAll(async () => {
      await request(app).post("/users").send(user);
      dataDelete.push(`'${String(user.email)}'`);
    });

    it("testes de validação de campos", async () => {
      await verifyValidationsKeys("post", "/users", [
        "name",
        "username",
        "password",
        "email",
      ]);
    });

    it("Criando usuario com username já criado", async () => {
      const response = await request(app).post("/users").send({
        name: "test-post-user-username-in-use",
        username: "test-in-use",
        password: "test1234",
        email: "test1234567@test.com",
      });

      expect(response.body.msg).toBe(
        "Apelido já cadastrado, tente utilizar outro apelido!",
      );
      expect(response.statusCode).toBe(400);
    });

    it("Criando usuario com email já criado", async () => {
      const response = await request(app).post("/users").send({
        name: "test-post-user-email-in-use",
        username: "test-not-in-yse",
        password: "test1234",
        email: "test-in-use@test.com",
      });

      expect(response.body.msg).toBe("Email já cadastrado, tente fazer login!");
      expect(response.statusCode).toBe(400);
    });

    it("Criando usuario", async () => {
      const user: IUserSchema = {
        name: "test-post-user",
        username: "test-post-user",
        password: "teste1234",
        email: "test-post-user@test.com",
      };

      dataDelete.push(`'${user.email}'`);
      const response = await request(app).post("/users").send(user);

      expect(response.body.msg).toBe("Usuário cadastrado com sucesso!");
      expect(response.statusCode).toBe(201);
    });
  });

  describe("get users/find", () => {
    const user: IUserSchema = {
      name: "teste-user",
      username: "teste-user",
      password: "teste1234",
      email: "test-user-test@test.com",
    };

    dataDelete.push(`'${String(user.email)}'`);
    beforeAll(async () => {
      await request(app).post("/users").send(user);
    });

    it("Procurando um usuario sem id e sem username", async () => {
      const response = await request(app).get("/users/find");

      expect(response.body.msg).toBe("Não conseguimos encontrar!");
      expect(response.statusCode).toBe(404);
    });

    it("Procurando um usuario que não está no banco de dados", async () => {
      const response = await request(app).get(
        "/users/find?id=test&&username=test1",
      );

      expect(response.body.msg).toBe("Não conseguimos encontrar!");
      expect(response.statusCode).toBe(404);
    });

    it("Procurando um usuario por username", async () => {
      const response = await request(app).get(
        "/users/find?id=test&&username=teste-user",
      );

      expect(response.body.msg).toBe("Usuário encontrado com sucesso!");
      expect(response.statusCode).toBe(200);
      expect(response.body.data.name).toBe(user.name);
      expect(response.body.data.username).toBe(user.username);
    });
  });

  describe("delete users/:id", () => {
    const user: IUserSchema = {
      name: "test-user-delete",
      username: "test-user-delete",
      password: "teste1234",
      email: "test-user-delete-test@test.com",
    };

    dataDelete.push(`'${String(user.email)}'`);

    let token: string | undefined;
    let id: string | undefined;

    beforeAll(async () => {
      [token, id] = await fetchLoginData(user);
    });

    it("testes de validação de token e id", async () => {
      await verifyTokenAndID("delete", `/users/${id}`, token, {
        name: "test-token-validation",
        username: "test-token",
      });
    });

    it("usuario deletado", async () => {
      const response = await request(app)
        .delete(`/users/${id}`)
        .set("authorization", `token ${token}`);

      expect(response.body.msg).toBe("Usuário deletado com sucesso!");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("update users/:id", () => {
    const user: IUserSchema = {
      name: "test-user-update",
      username: "test-user-update",
      password: "teste1234",
      email: "test-user-update-test@test.com",
    };

    dataDelete.push(`'${String(user.email)}'`);

    let token: string | undefined;
    let id: string | undefined;

    beforeAll(async () => {
      [token, id] = await fetchLoginData(user);
    });

    it("testes de validação de campos", async () => {
      await verifyValidationsKeys("patch", `/users/${id}`, [
        "name",
        "username",
      ]);
    });

    it("testes de validação de token e id", async () => {
      await verifyTokenAndID("patch", `/users/${id}`, token, {
        name: "test-token-validation",
        username: "test-token",
      });
    });

    it("atualizando com username já utilizado", async () => {
      const response = await request(app)
        .patch(`/users/${id}`)
        .send({
          name: "test-user-update-new",
          username: "test-in-use",
        })
        .set("authorization", `token ${token}`);

      expect(response.body.msg).toBe(
        "Apelido já cadastrado, tente utilizar outro apelido!",
      );
      expect(response.statusCode).toBe(400);
    });

    it("user atualizado", async () => {
      const response = await request(app)
        .patch(`/users/${id}`)
        .send({
          name: "test-user-update-new",
          username: "test-user-update",
        })
        .set("authorization", `token ${token}`);

      expect(response.body.msg).toBe("Usuário atualizado com sucesso!");
      expect(response.statusCode).toBe(200);
    });
  });
});
