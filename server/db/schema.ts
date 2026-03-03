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

export const cardsStats = createTable(
  "cards_stats",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    wordsCompleted: integer("words_completed").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (table) => {
    return {
      userIdIndex: index("cards_user_id_index").on(table.userId),
    };
  },
);

export const matchUpStats = createTable(
  "match_up_stats",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    accuracy: doublePrecision("accuracy").notNull(),
    mistakes: integer("mistakes").notNull(),
    initialLives: integer("initial_lives").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (table) => {
    return {
      userIdIndex: index("match_up_user_id_index").on(table.userId),
    };
  },
);
