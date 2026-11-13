CREATE TABLE "home_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"draft_config" jsonb NOT NULL,
	"published_config" jsonb,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "venues" ADD COLUMN "code" varchar(50);--> statement-breakpoint
ALTER TABLE "venues" ADD COLUMN "price_from" integer;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "event_type" varchar(100);--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "notes" jsonb DEFAULT '[]'::jsonb NOT NULL;