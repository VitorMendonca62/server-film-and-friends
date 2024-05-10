
// Components
import { connection } from '../../database';

export async function deleteAllData(
  table: "users" | "movies" | "series" | "users_media_info",
  key: string,
  values: string[],
) {
  await connection.query(
    `DELETE FROM ${table} WHERE ${key} IN (${values.join(",")})`,
  );
}