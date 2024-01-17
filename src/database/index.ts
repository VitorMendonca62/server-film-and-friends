// Modules
import { Sequelize } from "sequelize-typescript";


// Config
import configDatabase from "../config/database";

// Connection
export const connection = new Sequelize({
  ...configDatabase,
  models: [__dirname + "/**/*.model.ts"],
});

export function startDatabase(): void {
  connection.addModels([__dirname + "/**/*.model.ts"]);

  try {
    connection.sync(); // force: true irá recriar a tabela se ela já existir
    console.log("[DATABASE] Database connected successfully");
  } catch (err) {
    console.error("[DATABASE] Database connection was interrupted:", err);
  }

}
