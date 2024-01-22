// Modules
import { Sequelize } from "sequelize-typescript";

// Config
import configDatabase from "../config/database";
import { config } from "dotenv";

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
