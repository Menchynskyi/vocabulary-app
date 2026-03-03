CREATE TABLE IF NOT EXISTS "vocabulary_user_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"game" varchar(50) NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_settings_user_id_index" ON "vocabulary_user_settings" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_settings_user_game_unique_index" ON "vocabulary_user_settings" ("user_id","game");