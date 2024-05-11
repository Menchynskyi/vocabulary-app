import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  timestamp,
  doublePrecision,
  varchar,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `vocabulary_${name}`);

export const blanksStats = createTable(
  "blanks_stats",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    accuracy: doublePrecision("accuracy").notNull(),
    avgAccuracy: doublePrecision("avg_accuracy").notNull(),
    attemptNumber: integer("attempt_number").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (table) => {
    return {
      userIdIndex: index("user_id_index").on(table.userId),
    };
  },
);
