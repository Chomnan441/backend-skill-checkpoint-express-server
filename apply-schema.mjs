import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectionPool from "./utils/db.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaSql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

try {
  await connectionPool.query(schemaSql);
  console.log("Schema applied successfully (ON DELETE CASCADE ensured).");
} catch (error) {
  console.error("Failed to apply schema:", error.message);
  process.exitCode = 1;
} finally {
  await connectionPool.end();
}
