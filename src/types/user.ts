interface IUser {
  id: string | undefined;
  name: string | undefined;
  username: string | undefined;
  email: string | undefined;
  role: string | undefined;
  password: string | undefined;
  passwordHash: string | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

export default IUser;
