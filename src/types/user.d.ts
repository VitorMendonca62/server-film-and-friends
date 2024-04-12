interface IUserBasicOutputcSchema {
  id: string;
  name: string;
  username: string;
  email: string;
}
interface IUserBasicInputcSchema {
  name: string;
  username: string;
  email: string;
  password: string;
}
interface IUser extends IUserBasicOutputcSchema {
  role: "admin" | "user";
  password: string;
  passwordHash: string;
}
interface IUserUpdateNameOrUsername {
  name: string;
  username: string;}
interface IUserUpdatPassword {
  oldPassword: string;
  newPassword: string;
}


interface IUsersAcessCode {
  [key: string]: string;
}

interface IUsersAcess {
  [key: string]: boolean;
}

type NameAndUsername = {
  name: string;
  username: string;
};
interface JwtPayload {
  id: string;
}
