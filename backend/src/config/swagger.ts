
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const swaggerFile = resolve(
  process.cwd(),
  "swagger-output.json"
);

export const swaggerDocument = JSON.parse(
  readFileSync(swaggerFile, "utf-8")
);
