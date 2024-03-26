interface IConfigDatabase {
  dialect?: Dialect | undefined;
  host?: string | undefined;
  username?: string | undefined;
  password?: string | undefined;
  database?: string | undefined;
  port?: number | undefined;
}