
// Components
import { connection } from '../../database';

export async function deleteAllData(
  table: "users" | "movies" | "series",
  key: string,
  values: string[],
) {
  await connection.query(
    `DELETE FROM ${table} WHERE ${key} IN (${values.join(",")})`,
  );
}