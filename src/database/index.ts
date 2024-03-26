// Libraries
import { Sequelize } from "sequelize-typescript";
import { config } from "dotenv";

// Config
import configDatabase from "../config/database";

config();

// Connection
export const connection = new Sequelize({
  ...configDatabase,
  models: [__dirname + "/**/*.model.ts"],
});


export async function startDatabase() {
  connection.addModels([__dirname + "/**/*.model.ts"]);

  try {
    connection.sync();
    console.log("[DATABASE] Database connected successfully");
  } catch (err) {
    console.error("[DATABASE] Database connection was interrupted:", err);
  }
}
