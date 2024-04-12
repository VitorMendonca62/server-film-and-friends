interface IConfigDatabase {
  dialect?: Dialect;
  host?: string;
  username?: string;
  password?: string;
  database?: string;
  port?: number;
}

type TypeModel = Movie | Serie