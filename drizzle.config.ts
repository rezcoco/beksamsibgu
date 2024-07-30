import { defineConfig } from "drizzle-kit";
import "@/drizzle/envConfig"

export default defineConfig({
  schema: "src/drizzle/schema.ts",
  out: "src/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
