// TUDO OK

// Libraries
import {app} from "../../app";
import request from "supertest";

// Utils
// Components
import { usersAcess, usersAcessCode } from "./PasswordController";
import { fetchLoginData, verifyTokenAndID } from "../../utils/tests/user";
import { deleteAllData } from "../../utils/tests/general";

const email = "test_email@test.com";

const dataDelete: string[] = [];

describe("teste de esquecer senha", () => {
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
    deleteAllData("users", "email", dataDelete);
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
  
  describe("post /users/password/code", () => {
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
  
    let token: string;
    let id: string;
  
    beforeAll(async () => {
      [token, id] = await fetchLoginData(user);
    });
  
    it("testes de validação de token e id", async () => {
      await verifyTokenAndID(
        "patch",
        `/users/password/${id}`,
        `/users/password/test`,
        token,
        {
          oldPassword: "test1234",
          newPassword: "test-token",
        },
      );
    });
  
    it("password is wrong", async () => {
      const response = await request(app)
        .patch(`/users/password/${id}`)
        .set("authorization", `token ${token}`)
        .send({ oldPassword: "passwrong", newPassword: "undefined" });
  
      expect(response.body.msg).toBe("A senha antiga está incorreta!");
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });
  
    it("password correct", async () => {
      const response = await request(app)
        .patch(`/users/password/${id}`)
        .set("authorization", `token ${token}`)
        .send({ oldPassword: "test1234", newPassword: "undefined" });
  
      expect(response.body.msg).toBe("Senha atualizada com sucesso!");
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toBe(false);
    });
  });
});

