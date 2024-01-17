import { config } from "dotenv";
// import IConfigDatabase from "../types/database";
import { Options, Dialect } from "sequelize";

config();

interface IConfigDatabase {
  dialect?: Dialect | undefined;
  host?: string | undefined;
  username?: string | undefined;
  password?: string | undefined;
  database?: string | undefined;
  port?: number | undefined;
}

const configDatabase: IConfigDatabase = {
  dialect: "mysql",
  host: process.env.DATABASE_HOST,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.DATABASE_PORT),
};
console.log(configDatabase)

const convertToSequelizeOptions = (
  configDatabase: IConfigDatabase,
): Options => {
  return { ...configDatabase };
};

export default convertToSequelizeOptions(
  convertToSequelizeOptions(configDatabase),
);
