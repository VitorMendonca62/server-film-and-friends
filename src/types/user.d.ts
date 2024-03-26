interface IUser {
  id: string | undefined;
  name: string | undefined;
  username: string | undefined;
  email: string | undefined;
  role: "admin" | "user";
  password: string | undefined;
  passwordHash: string | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

interface IUserSchema {
  name: string | undefined;
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
}
interface IUserUpdateSchema {
  username: string | undefined;
  name: string | undefined;
}

interface IUserUpdatePassword {
  password: string | undefined;
  newPassword: string | undefined;
}
interface JwtPayload {
  id: string;
}