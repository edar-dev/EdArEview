import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Phase 2: EdArEview CMS schema (media-works, reviews, tags, site-settings).
 * Drops Payload website template collections; keeps users + media.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "footer_rels" CASCADE;
    DROP TABLE IF EXISTS "footer_nav_items" CASCADE;
    DROP TABLE IF EXISTS "footer" CASCADE;
    DROP TABLE IF EXISTS "header_rels" CASCADE;
    DROP TABLE IF EXISTS "header_nav_items" CASCADE;
    DROP TABLE IF EXISTS "header" CASCADE;
    DROP TABLE IF EXISTS "search_rels" CASCADE;
    DROP TABLE IF EXISTS "search_categories" CASCADE;
    DROP TABLE IF EXISTS "search" CASCADE;
    DROP TABLE IF EXISTS "form_submissions_submission_data" CASCADE;
    DROP TABLE IF EXISTS "form_submissions" CASCADE;
    DROP TABLE IF EXISTS "forms_emails" CASCADE;
    DROP TABLE IF EXISTS "forms_blocks_checkbox" CASCADE;
    DROP TABLE IF EXISTS "forms_blocks_country" CASCADE;
    DROP TABLE IF EXISTS "forms_blocks_email" CASCADE;
    DROP TABLE IF EXISTS "forms_blocks_message" CASCADE;
    DROP TABLE IF EXISTS "forms_blocks_number" CASCADE;
    DROP TABLE IF EXISTS "forms_blocks_select_options" CASCADE;
    DROP TABLE IF EXISTS "forms_blocks_select" CASCADE;
    DROP TABLE IF EXISTS "forms_blocks_state" CASCADE;
    DROP TABLE IF EXISTS "forms_blocks_text" CASCADE;
    DROP TABLE IF EXISTS "forms_blocks_textarea" CASCADE;
    DROP TABLE IF EXISTS "forms" CASCADE;
    DROP TABLE IF EXISTS "redirects_rels" CASCADE;
    DROP TABLE IF EXISTS "redirects" CASCADE;
    DROP TABLE IF EXISTS "categories_breadcrumbs" CASCADE;
    DROP TABLE IF EXISTS "categories" CASCADE;
    DROP TABLE IF EXISTS "_posts_v_rels" CASCADE;
    DROP TABLE IF EXISTS "_posts_v_version_populated_authors" CASCADE;
    DROP TABLE IF EXISTS "_posts_v" CASCADE;
    DROP TABLE IF EXISTS "posts_rels" CASCADE;
    DROP TABLE IF EXISTS "posts_populated_authors" CASCADE;
    DROP TABLE IF EXISTS "posts" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_rels" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_form_block" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_archive" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_media_block" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_content" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_content_columns" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_cta" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_cta_links" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_version_hero_links" CASCADE;
    DROP TABLE IF EXISTS "_pages_v" CASCADE;
    DROP TABLE IF EXISTS "pages_rels" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_form_block" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_archive" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_media_block" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_content" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_content_columns" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_cta" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_cta_links" CASCADE;
    DROP TABLE IF EXISTS "pages_hero_links" CASCADE;
    DROP TABLE IF EXISTS "pages" CASCADE;
    DROP TABLE IF EXISTS "payload_jobs_log" CASCADE;
    DROP TABLE IF EXISTS "payload_jobs" CASCADE;
    DROP TABLE IF EXISTS "payload_folders_folder_type" CASCADE;
    DROP TABLE IF EXISTS "payload_folders" CASCADE;
    DROP TABLE IF EXISTS "payload_locked_documents_rels" CASCADE;

    DROP TYPE IF EXISTS "public"."enum_pages_hero_links_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_hero_links_link_appearance";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_cta_links_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_cta_links_link_appearance";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_content_columns_size";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_content_columns_link_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_content_columns_link_appearance";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_archive_populate_by";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_archive_relation_to";
    DROP TYPE IF EXISTS "public"."enum_pages_hero_type";
    DROP TYPE IF EXISTS "public"."enum_pages_status";
    DROP TYPE IF EXISTS "public"."enum__pages_v_version_hero_links_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_version_hero_links_link_appearance";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_cta_links_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_cta_links_link_appearance";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_content_columns_size";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_content_columns_link_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_content_columns_link_appearance";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_archive_populate_by";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_archive_relation_to";
    DROP TYPE IF EXISTS "public"."enum__pages_v_version_hero_type";
    DROP TYPE IF EXISTS "public"."enum__pages_v_version_status";
    DROP TYPE IF EXISTS "public"."enum_posts_status";
    DROP TYPE IF EXISTS "public"."enum__posts_v_version_status";
    DROP TYPE IF EXISTS "public"."enum_redirects_to_type";
    DROP TYPE IF EXISTS "public"."enum_forms_confirmation_type";
    DROP TYPE IF EXISTS "public"."enum_payload_jobs_log_task_slug";
    DROP TYPE IF EXISTS "public"."enum_payload_jobs_log_state";
    DROP TYPE IF EXISTS "public"."enum_payload_jobs_task_slug";
    DROP TYPE IF EXISTS "public"."enum_payload_folders_folder_type";
    DROP TYPE IF EXISTS "public"."enum_header_nav_items_link_type";
    DROP TYPE IF EXISTS "public"."enum_footer_nav_items_link_type";

    CREATE TYPE "public"."enum_media_works_media_type" AS ENUM('anime', 'manga', 'tv', 'movie', 'game');
    CREATE TYPE "public"."enum_media_works_external_source" AS ENUM('manual', 'anilist', 'tmdb', 'igdb');
    CREATE TYPE "public"."enum_media_works_status" AS ENUM('draft', 'published');
    CREATE TYPE "public"."enum_reviews_watch_status" AS ENUM('planned', 'watching', 'completed', 'dropped', 'on_hold');
    CREATE TYPE "public"."enum_reviews_status" AS ENUM('draft', 'published');

    CREATE TABLE "media_works" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "title_original" varchar,
      "media_type" "enum_media_works_media_type" NOT NULL,
      "external_source" "enum_media_works_external_source" DEFAULT 'manual' NOT NULL,
      "external_id" varchar,
      "year" numeric,
      "cover_url" varchar,
      "cover_id" integer,
      "metadata" jsonb,
      "status" "enum_media_works_status" DEFAULT 'draft' NOT NULL,
      "published_at" timestamp(3) with time zone,
      "generate_slug" boolean DEFAULT true,
      "slug" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "media_works_genres" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "genre" varchar NOT NULL
    );

    CREATE TABLE "tags" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "generate_slug" boolean DEFAULT true,
      "slug" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "reviews" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "media_work_id" integer NOT NULL,
      "body" jsonb NOT NULL,
      "rating" numeric,
      "watch_status" "enum_reviews_watch_status",
      "has_spoilers" boolean DEFAULT false,
      "status" "enum_reviews_status" DEFAULT 'draft' NOT NULL,
      "published_at" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "reviews_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "tags_id" integer
    );

    CREATE TABLE "site_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "site_name" varchar DEFAULT 'EdArEview' NOT NULL,
      "tagline" varchar,
      "bio" varchar,
      "avatar_id" integer,
      "homepage_intro" jsonb,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE "site_settings_social_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "platform" varchar NOT NULL,
      "url" varchar NOT NULL
    );

    CREATE TABLE "payload_locked_documents_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "users_id" integer,
      "media_works_id" integer,
      "reviews_id" integer,
      "tags_id" integer,
      "media_id" integer
    );

    ALTER TABLE "media_works" ADD CONSTRAINT "media_works_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "media_works_genres" ADD CONSTRAINT "media_works_genres_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media_works"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "reviews" ADD CONSTRAINT "reviews_media_work_id_media_works_id_fk" FOREIGN KEY ("media_work_id") REFERENCES "public"."media_works"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "reviews_rels" ADD CONSTRAINT "reviews_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "reviews_rels" ADD CONSTRAINT "reviews_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_works_fk" FOREIGN KEY ("media_works_id") REFERENCES "public"."media_works"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "media_works_title_idx" ON "media_works" USING btree ("title");
    CREATE INDEX "media_works_media_type_idx" ON "media_works" USING btree ("media_type");
    CREATE INDEX "media_works_cover_idx" ON "media_works" USING btree ("cover_id");
    CREATE UNIQUE INDEX "media_works_slug_idx" ON "media_works" USING btree ("slug");
    CREATE INDEX "media_works_updated_at_idx" ON "media_works" USING btree ("updated_at");
    CREATE INDEX "media_works_created_at_idx" ON "media_works" USING btree ("created_at");
    CREATE INDEX "media_works_genres_order_idx" ON "media_works_genres" USING btree ("_order");
    CREATE INDEX "media_works_genres_parent_id_idx" ON "media_works_genres" USING btree ("_parent_id");
    CREATE UNIQUE INDEX "tags_name_idx" ON "tags" USING btree ("name");
    CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
    CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
    CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
    CREATE INDEX "reviews_media_work_idx" ON "reviews" USING btree ("media_work_id");
    CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
    CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
    CREATE INDEX "reviews_rels_order_idx" ON "reviews_rels" USING btree ("order");
    CREATE INDEX "reviews_rels_parent_idx" ON "reviews_rels" USING btree ("parent_id");
    CREATE INDEX "reviews_rels_path_idx" ON "reviews_rels" USING btree ("path");
    CREATE INDEX "reviews_rels_tags_id_idx" ON "reviews_rels" USING btree ("tags_id");
    CREATE INDEX "site_settings_avatar_idx" ON "site_settings" USING btree ("avatar_id");
    CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
    CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
    CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
    CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
    CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
    CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
    CREATE INDEX "payload_locked_documents_rels_media_works_id_idx" ON "payload_locked_documents_rels" USING btree ("media_works_id");
    CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
    CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
    CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "payload_locked_documents_rels" CASCADE;
    DROP TABLE IF EXISTS "site_settings_social_links" CASCADE;
    DROP TABLE IF EXISTS "site_settings" CASCADE;
    DROP TABLE IF EXISTS "reviews_rels" CASCADE;
    DROP TABLE IF EXISTS "reviews" CASCADE;
    DROP TABLE IF EXISTS "tags" CASCADE;
    DROP TABLE IF EXISTS "media_works_genres" CASCADE;
    DROP TABLE IF EXISTS "media_works" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_reviews_status";
    DROP TYPE IF EXISTS "public"."enum_reviews_watch_status";
    DROP TYPE IF EXISTS "public"."enum_media_works_status";
    DROP TYPE IF EXISTS "public"."enum_media_works_external_source";
    DROP TYPE IF EXISTS "public"."enum_media_works_media_type";
  `)
}
