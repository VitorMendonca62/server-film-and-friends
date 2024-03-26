// Libraries
import request from "supertest";
import { jwtDecode } from "jwt-decode";

// Utils
import { textsInputsErrors } from "./texts";

// Components
import app from "../app";

const exemples = {
  name: {
    required: undefined,
    max: "test-post-user-with-name-long-test-post-user-with-name-long-",
    min: "test",
    standard: "test-user-validation",
  },
  username: {
    required: undefined,
    max: "test-post-user-with-name-long-test-post-user-with-name-long-",
    min: "tes",
    standard: "test-username-validation",
  },
  email: {
    required: undefined,
    email: "test.wadawd",
    standard: "test-validation@test.com",
  },
  password: {
    required: undefined,
    min: "123",
    standard: "test12324",
  },
};

export async function testValidation(
  method: Method,
  route: string,
  data: IData,
  key: Key,
  keyMsg: KeyMsg,
): Promise<boolean> {
  const response = await request(app)[method](route).send(data);

  const keysTextKey = textsInputsErrors[key] as ObjectKeyMsg;
  const conditionMsg = response.body.msg === keysTextKey[keyMsg];
  const conditionStatusCode = response.statusCode === 400;
  const conditionType = response.body.type === key;

  return conditionMsg && conditionStatusCode && conditionType;
}

export async function verifyValidationsKeys(
  method: Method,
  route: string,
  keys: Key[],
) {
  for (const key of keys) {
    if (key != "email") {
      const userWithoutKeyEmail: IUserSchema = {
        name: exemples.name[key === "name" ? "min" : "standard"],
        username: exemples.username[key === "username" ? "min" : "standard"],
        password: exemples.password[key === "password" ? "min" : "standard"],
        email: exemples.email.standard,
      };

      expect(
        await testValidation(method, route, userWithoutKeyEmail, key, "min"),
      ).toBe(true);

      if (key != "password") {
        const userWithoutKeyPass: IUserSchema = {
          name: exemples.name[key === "name" ? "max" : "standard"],
          username: exemples.username[key === "username" ? "max" : "standard"],
          password: exemples.password.standard,
          email: exemples.email.standard,
        };

        expect(
          await testValidation(method, route, userWithoutKeyPass, key, "max"),
        ).toBe(true);
      }
    }

    if (key == "email") {
      const userWithKeyEmail: IUserSchema = {
        name: exemples.name.standard,
        username: exemples.username.standard,
        password: exemples.password.standard,
        email: exemples.email.email,
      };

      expect(
        await testValidation(
          "post",
          "/users",
          userWithKeyEmail,
          "email",
          "email",
        ),
      ).toBe(true);
    }

    const user: IUserSchema = {
      name: exemples.name[key === "name" ? "required" : "standard"],
      username: exemples.username[key === "username" ? "required" : "standard"],
      password: exemples.password[key === "password" ? "required" : "standard"],
      email: exemples.email[key === "email" ? "required" : "standard"],
    };

    expect(await testValidation(method, route, user, key, "required")).toBe(
      true,
    );
  }
  // return true;
}

export async function verifyTokenAndID(
  method: Method,
  route: string,
  token: string | undefined,
  user: IUserUpdateSchema | IUserUpdatePassword,
) {
  const responseToken = await request(app)[method](route).send(user);

  expect(responseToken.body.msg).toBe("Não conseguimos encontrar!");
  expect(responseToken.statusCode).toBe(404);

  const responseIDAndToken = await request(app)[method]("/users/test")
    .send(user)
    .set("authorization", `token ${token}`);

  expect(responseIDAndToken.body.msg).toBe("Algo deu errado!");
  expect(responseIDAndToken.statusCode).toBe(400);
}

export async function fetchLoginData(user: IUserSchema) {
  await request(app).post("/users").send(user);

  const loginResponse = await request(app)
    .post("/auth/login")
    .send({ email: user.email, password: user.password });

  const token = loginResponse.body.token;
  const decodedToken = jwtDecode(token) as JwtPayload;
  const { id } = decodedToken;
  return [token, id];
}

