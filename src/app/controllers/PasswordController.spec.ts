import app from "../../app";
import request from "supertest";
import { jwtDecode } from "jwt-decode";
import { deleteAllData } from "../../utils/general";

import { usersAcess, usersAcessCode } from "./PasswordController";
const email = "test_email@test.com";

interface JwtPayload {
  id: string;
}

describe("teste de esquecer senha", () => {
  describe("post /users/password/email", () => {
    beforeAll(async () => {
      const user = {
        name: "testemail",
        username: "test_email",
        password: "test1234",
        email,
      };
      await request(app).post("/users").send(user);
    });
  
    it("email invalido", async () => {
      const response = await request(app)
        .post("/users/password/email")
        .send({ email: "test.com" });
  
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.msg).toBe("Email inválido");
      expect(response.body.type).toBe("email");
    });
  
    it("email undefined", async () => {
      const response = await request(app)
        .post("/users/password/email")
        .send({ email: undefined });
  
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.msg).toBe("Email é obrigatório");
      expect(response.body.type).toBe("email");
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
    it("email invalido", async () => {
      const response = await request(app)
        .post("/users/password/code")
        .send({ email: "test.com", code: "waddw" });
  
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.msg).toBe("Email inválido");
      expect(response.body.type).toBe("email");
    });
  
    it("email undefined", async () => {
      const response = await request(app)
        .post("/users/password/code")
        .send({ email: undefined, code: "wad" });
  
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.msg).toBe("Email é obrigatório");
      expect(response.body.type).toBe("email");
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
    afterAll(async () => {
      deleteAllData();
    });
  
    it("email invalido", async () => {
      const response = await request(app)
        .patch("/users/password/update")
        .send({ email: "test.com", newPassword: "12345678" });
  
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.msg).toBe("Email inválido");
      expect(response.body.type).toBe("email");
    });
  
    it("email undefined", async () => {
      const response = await request(app)
        .patch("/users/password/update")
        .send({ email: undefined, newPassword: "12345678" });
  
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.msg).toBe("Email é obrigatório");
      expect(response.body.type).toBe("email");
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
})


describe("patch /users/password/:id", () => {
  const infos = {
    id: "",
    token: "",
  };

  beforeAll(async () => {
    const user = {
      name: "testemail",
      username: "testemail20sla",
      password: "test1234",
      email: "testpassoword@test.com",
    };

    await request(app).post("/users").send(user);

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: user.password });

    const token = loginResponse.body.token;
    const decodedToken = jwtDecode(token) as JwtPayload;
    const { id } = decodedToken;
    infos.id = id;
    infos.token = token;
  });

  afterAll(async () => {
    deleteAllData();
  });

  it("senha antiga curta", async () => {
    const response = await request(app)
      .patch(`/users/password/${infos.id}`)
      .send({ password: "1234", newPassword: "1234578910" });

    expect(response.body.msg).toBe("A senha antiga é curta demais!");
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.type).toBe("password");
  });

  it("senha undefined", async () => {
    const response = await request(app)
      .patch(`/users/password/${infos.id}`)
      .send({ password: undefined, newPassword: "1234578910" });

    expect(response.body.msg).toBe("Senha antiga é obrigatória");
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.type).toBe("password");
  });

  it("nova senha curta", async () => {
    const response = await request(app)
      .patch(`/users/password/${infos.id}`)
      .send({ password: "test1234", newPassword: "1234" });

    expect(response.body.msg).toBe("A senha nova é curta demais!");
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.type).toBe("newPassword");
  });

  it("nova senha undefined", async () => {
    const response = await request(app)
      .patch(`/users/password/${infos.id}`)
      .send({ password: "test1234", newPassword: undefined });

    expect(response.body.msg).toBe("Senha nova é obrigatória");
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
    expect(response.body.type).toBe("newPassword");
  });

  it("authorization undefined", async () => {
    const response = await request(app)
      .patch(`/users/password/${infos.id}`)
      .send({ password: "test1234", newPassword: "undefined" });

    expect(response.body.msg).toBe("Não conseguimos encontrar!");
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe(true);
  });

  it("id body is diffent in token", async () => {
    const response = await request(app)
      .patch(`/users/password/testttt`)
      .set("authorization", `token ${infos.token}`)
      .send({ password: "test1234", newPassword: "undefined" });

    expect(response.body.msg).toBe("Algo deu errado!");
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("password is wrong", async () => {
    const response = await request(app)
      .patch(`/users/password/${infos.id}`)
      .set("authorization", `token ${infos.token}`)
      .send({ password: "passwrong", newPassword: "undefined" });

    expect(response.body.msg).toBe("A senha antiga está incorreta!");
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(true);
  });

  it("password correct", async () => {
    const response = await request(app)
      .patch(`/users/password/${infos.id}`)
      .set("authorization", `token ${infos.token}`)
      .send({ password: "test1234", newPassword: "undefined" });

    expect(response.body.msg).toBe("Senha atualizada com sucesso!");
    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe(false);
  });
});

