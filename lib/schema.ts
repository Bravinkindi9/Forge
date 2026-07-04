import { jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const inputTypeEnum = pgEnum("input_type", ["url", "pasted_text", "raw_thought"]);

export const entries = pgTable("entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  inputType: inputTypeEnum("input_type").notNull(),
  rawInput: text("raw_input").notNull(),
  extractedContent: text("extracted_content"),
  summary: text("summary"),
  questions: jsonb("questions").$type<string[]>(),
  answers: jsonb("answers").$type<string[]>(),
  additionalThoughts: text("additional_thoughts"),
  draft: text("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
