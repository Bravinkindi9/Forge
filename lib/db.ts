import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/schema";

let cached: PostgresJsDatabase<typeof schema> | null = null;

function getDb(): PostgresJsDatabase<typeof schema> {
  if (cached) return cached;

  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("POSTGRES_URL is not set. Copy .env.example to .env.local and fill it in.");
  }

  const client = postgres(connectionString, { max: 1 });
  cached = drizzle(client, { schema });
  return cached;
}

// Proxy so `db.select()`, `db.insert()`, etc. only connect on first real use,
// not at module import time (which would break `next build`).
export const db: PostgresJsDatabase<typeof schema> = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(_target, prop) {
    return getDb()[prop as keyof PostgresJsDatabase<typeof schema>];
  },
});
