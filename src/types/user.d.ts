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

type UserRoles = "admin" | "user"
interface IUser extends IUserBasicOutputcSchema {
  role: UserRoles;
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

interface IUserMediaInfo {
  id: string;
  userId: string;
  mediaId: string;
  rating?: number;
  favorite?: boolean;
}