// Libraries
import request from "supertest";
import { jwtDecode } from "jwt-decode";

// Utils

// Components
import {app} from "../../app";

export async function verifyTokenAndID(
  method: Method,
  route1: string,
  route2: string,
  token: string,
  user: IUserUpdateNameOrUsername | IUserUpdatPassword,
) {
  const responseNothingToken = await request(app)[method](route1).send(user);

  expect(responseNothingToken.body.msg).toBe("Não conseguimos encontrar!");
  expect(responseNothingToken.statusCode).toBe(404);

  const responseWithTokenAndNotEqualsID = await request(app)[method](route2)
    .send(user)
    .set("authorization", `token ${token}`);

  expect(responseWithTokenAndNotEqualsID.body.msg).toBe("Algo deu errado!");
  expect(responseWithTokenAndNotEqualsID.statusCode).toBe(400);
}

export async function fetchLoginData(user: IUserBasicInputcSchema) {
  await request(app).post("/users").send(user);
  const loginResponse = await request(app)
    .post("/users/auth/login")
    .send({ email: user.email, password: user.password });

  const token = loginResponse.body.token as string;
  const decodedToken = jwtDecode(token) as JwtPayload;
  const { id } = decodedToken;
  return [token, id];
}
