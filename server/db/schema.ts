import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  timestamp,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `vocabulary_${name}`);

export const blanksStats = createTable("blanks_stats", {
  id: serial("id").primaryKey(),
  accuracy: doublePrecision("accuracy").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});
