import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  timestamp,
  doublePrecision,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `vocabulary_${name}`);

export const blanksStats = createTable("blanks_stats", {
  id: serial("id").primaryKey(),
  accuracy: doublePrecision("accuracy").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  updatedAt: timestamp("updatedAt"),
});
