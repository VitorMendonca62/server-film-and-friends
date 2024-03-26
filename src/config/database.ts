import { config } from "dotenv";
import { Options } from "sequelize";

config();

const configDatabase: IConfigDatabase = {
  dialect: "mysql",
  host: process.env.DATABASE_HOST,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.DATABASE_PORT),
};

const convertToSequelizeOptions = (
  configDatabase: IConfigDatabase,
): Options => {
  return { ...configDatabase };
};

export default convertToSequelizeOptions(
  convertToSequelizeOptions(configDatabase),
);
