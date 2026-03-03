CREATE TABLE IF NOT EXISTS "vocabulary_context_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"accuracy" double precision NOT NULL,
	"avg_accuracy" double precision NOT NULL,
	"attempt_number" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "context_user_id_index" ON "vocabulary_context_stats" ("user_id");