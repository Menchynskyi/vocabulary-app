CREATE TABLE IF NOT EXISTS "vocabulary_blanks_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"accuracy" double precision NOT NULL,
	"avg_accuracy" double precision NOT NULL,
	"attempt_number" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vocabulary_cards_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"words_completed" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vocabulary_match_up_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"accuracy" double precision NOT NULL,
	"mistakes" integer NOT NULL,
	"initial_lives" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_index" ON "vocabulary_blanks_stats" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cards_user_id_index" ON "vocabulary_cards_stats" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "match_up_user_id_index" ON "vocabulary_match_up_stats" ("user_id");