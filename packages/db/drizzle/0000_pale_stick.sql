CREATE TABLE "artists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"tagline" text,
	"city" varchar(100) NOT NULL,
	"state" varchar(100),
	"phone" varchar(50),
	"email" varchar(255),
	"bio" text,
	"categories" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"specializations" jsonb DEFAULT '[]'::jsonb,
	"experience_years" integer,
	"projects_count" integer,
	"live_shows_count" integer,
	"total_followers_label" varchar(50),
	"height" varchar(50),
	"weight_kg" integer,
	"waist_in" integer,
	"chest_in" integer,
	"hair_type" varchar(50),
	"hair_length" varchar(50),
	"languages" jsonb DEFAULT '[]'::jsonb,
	"artist_class" varchar(50) DEFAULT 'standard' NOT NULL,
	"budget_range" varchar(50) DEFAULT 'not_set' NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_exclusive" boolean DEFAULT false NOT NULL,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"profile_photo_url" text,
	"profile_photo_alt_text" text,
	"completeness_percent" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "artists_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "artist_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artist_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" text,
	"url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artist_work" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artist_id" uuid NOT NULL,
	"kind" varchar(50) NOT NULL,
	"title" text NOT NULL,
	"category" varchar(100),
	"year" varchar(20),
	"description" text,
	"image_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artist_social" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artist_id" uuid NOT NULL,
	"instagram_url" text,
	"youtube_url" text,
	"facebook_url" text,
	"x_url" text,
	"spotify_url" text,
	"spotify_followers_label" varchar(50),
	"youtube_subscribers_label" varchar(50),
	"instagram_followers_label" varchar(50),
	"facebook_followers_label" varchar(50),
	"deezer_fans_label" varchar(50),
	"soundcloud_followers_label" varchar(50),
	"tiktok_followers_label" varchar(50),
	"seo_meta_title" varchar(60),
	"seo_meta_description" varchar(160),
	"seo_focus_keyword" varchar(100),
	"seo_canonical_url" text,
	"seo_share_image_url" text,
	"seo_show_in_search" boolean DEFAULT true NOT NULL,
	"seo_score" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "artist_social_artist_id_unique" UNIQUE("artist_id")
);
--> statement-breakpoint
CREATE TABLE "venues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100),
	"category" varchar(100),
	"capacity" integer,
	"price_label" varchar(100),
	"image_url" text,
	"description" text,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "venues_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"date" timestamp,
	"city" varchar(100) NOT NULL,
	"venue_name" varchar(255),
	"category" varchar(100),
	"badge" varchar(50) DEFAULT 'none' NOT NULL,
	"image_url" text,
	"description" text,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "home_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_key" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"ordered_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"hero_images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "home_sections_section_key_unique" UNIQUE("section_key")
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artist_id" uuid,
	"name" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"email" varchar(255),
	"city" varchar(100),
	"event_date" varchar(50),
	"budget_range" varchar(50),
	"message" text NOT NULL,
	"status" varchar(50) DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'admin' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "artist_media" ADD CONSTRAINT "artist_media_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_work" ADD CONSTRAINT "artist_work_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_social" ADD CONSTRAINT "artist_social_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE set null ON UPDATE no action;