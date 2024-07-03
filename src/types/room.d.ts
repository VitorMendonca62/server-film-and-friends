interface IUserInRoom {
  id: string;
  username: string;
  role: string;
}
interface IRoom {
  id: string;
  idAPI: string;
  author: string;
  participants: (IUserInRoom | null)[];
  path: string;
  type: TypeMedia;
}
