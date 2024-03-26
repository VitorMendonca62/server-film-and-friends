// Libraries
import app from "../../app";
import request from "supertest";

// Utils
import { deleteAllData } from "../../utils/general";

// Components
import { usersAcess, usersAcessCode } from "./PasswordController";
import {
  fetchLoginData,
  verifyTokenAndID,
  verifyValidationsKeys,
} from "../../utils/tests";

const email = "test_email@test.com";

describe("teste de esquecer senha", () => {
  const dataDelete: string[] = [];

  const user = {
    name: "testemail",
    username: "test_email",
    password: "test1234",
    email,
  };

  beforeAll(async () => {
    await request(app).post("/users").send(user);
  });

  dataDelete.push(`'${String(email)}'`);

  afterAll(() => {
    deleteAllData(dataDelete);
  });

  describe("post /users/password/email", () => {
    it("testes de validação de campos", async () => {
      await verifyValidationsKeys("post", "/users/password/email", ["email"]);
    });

    it("email sem usuario", async () => {
      const response = await request(app)
        .post("/users/password/email")
        .send({ email: "testemail@gmail.com" });

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe(true);
      expect(response.body.msg).toBe("Não conseguimos encontrar!");
    });

    it("email enviado", async () => {
      const response = await request(app)
        .post("/users/password/email")
        .send({ email });

      expect(response.body.msg).toBe(
        "Em breve, você vai receber um e-mail para redefinir sua senha. Se não conseguir encontrar o e-mail, lembre-se de procurar na pasta de spam ou lixo eletrônico.",
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toBe(false);
      expect(!!usersAcessCode[email]).toBe(true);
    });
  });

  describe("post /users/password/code", () => {
    it("testes de validação de campos", async () => {
      await verifyValidationsKeys("post", "/users/password/code", ["email"]);
    });

    it("code peequeno", async () => {
      const response = await request(app)
        .post("/users/password/code")
        .send({ email: "test@test.com", code: "addw" });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.msg).toBe("Códido incorreto");
      expect(response.body.type).toBe("code");
    });

    it("code undefined", async () => {
      const response = await request(app)
        .post("/users/password/code")
        .send({ email: "test@test.com", code: undefined });

      expect(response.body.msg).toBe("Código é obrigatório");
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.type).toBe("code");
    });

    it("codigo enviado incorreto", async () => {
      const response = await request(app)
        .post("/users/password/code")
        .send({ email: "testemail@gmail.com", code: "asdfgh" });

      expect(response.body.msg).toBe("Código incorreto!");
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });

    it("codigo enviado correto", async () => {
      const response = await request(app).post("/users/password/code").send({
        email: email,
        code: usersAcessCode[email],
      });

      expect(response.body.msg).toBe("Código correto!");
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toBe(false);
      expect(usersAcess[email]).toBe(true);
    });
  });

  describe("patch /users/password/update", () => {
    it("testes de validação de campos", async () => {
      await verifyValidationsKeys("patch", "/users/password/update", ["email"]);
    });

    it("senha undefined", async () => {
      const response = await request(app)
        .patch("/users/password/update")
        .send({ email, newPassword: undefined });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.msg).toBe("Senha nova é obrigatória");
      expect(response.body.type).toBe("newPassword");
    });

    it("senha curta", async () => {
      const response = await request(app)
        .patch("/users/password/update")
        .send({ email, newPassword: "12345" });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.msg).toBe("A senha nova é curta demais!");
      expect(response.body.type).toBe("newPassword");
    });

    it("usuario nao existe", async () => {
      const response = await request(app)
        .patch("/users/password/update")
        .send({ email: "luis@test.com", newPassword: "12345678" });

      expect(response.body.msg).toBe("Não conseguimos encontrar!");
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe(true);
    });

    it("usuario existe", async () => {
      const response = await request(app)
        .patch("/users/password/update")
        .send({ email, newPassword: "12345678910" });

      expect(response.body.msg).toBe("Senha atualizada com sucesso!");
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toBe(false);
    });
  });

  describe("patch /users/password/:id", () => {
    const user = {
      name: "testemail",
      username: "testemail20sla",
      password: "test1234",
      email: "testpassoword@test.com",
    };

    dataDelete.push(`'${String(user.email)}'`);

    let token: string | undefined;
    let id: string | undefined;

    beforeAll(async () => {
      [token, id] = await fetchLoginData(user);
    });

    it("testes de validação de campos", async () => {
      await verifyValidationsKeys("patch", `/users/password/${id}`, [
        "password",
      ]);
    });

    it("nova senha curta", async () => {
      const response = await request(app)
        .patch(`/users/password/${id}`)
        .send({ password: "test1234", newPassword: "1234" });

      expect(response.body.msg).toBe("A senha nova é curta demais!");
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.type).toBe("newPassword");
    });

    it("nova senha undefined", async () => {
      const response = await request(app)
        .patch(`/users/password/${id}`)
        .send({ password: "test1234", newPassword: undefined });

      expect(response.body.msg).toBe("Senha nova é obrigatória");
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.type).toBe("newPassword");
    });

    it("testes de validação de token e id", async () => {
      await verifyTokenAndID("patch", `/users/password/${id}`, token, {
        password: "test1234",
        newPassword: "test-token",
      });
    });

    it("password is wrong", async () => {
      const response = await request(app)
        .patch(`/users/password/${id}`)
        .set("authorization", `token ${token}`)
        .send({ password: "passwrong", newPassword: "undefined" });

      expect(response.body.msg).toBe("A senha antiga está incorreta!");
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });

    it("password correct", async () => {
      const response = await request(app)
        .patch(`/users/password/${id}`)
        .set("authorization", `token ${token}`)
        .send({ password: "test1234", newPassword: "undefined" });

      expect(response.body.msg).toBe("Senha atualizada com sucesso!");
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toBe(false);
    });
  });
});
