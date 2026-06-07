import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Phase 9: watchlist, full-text search, about page, extended metadata sources. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_media_works_external_source" ADD VALUE IF NOT EXISTS 'mal';
  `)
  await db.execute(sql`
    ALTER TYPE "public"."enum_media_works_external_source" ADD VALUE IF NOT EXISTS 'steam';
  `)
  await db.execute(sql`
    ALTER TYPE "public"."enum_media_works_external_source" ADD VALUE IF NOT EXISTS 'letterboxd';
  `)

  await db.execute(sql`
    ALTER TABLE "media_works"
      ADD COLUMN IF NOT EXISTS "watch_status" "enum_reviews_watch_status";

    ALTER TABLE "reviews"
      ADD COLUMN IF NOT EXISTS "search_vector" tsvector;

    CREATE INDEX IF NOT EXISTS "reviews_search_vector_idx"
      ON "reviews" USING gin("search_vector");

    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "about_page" jsonb;

    UPDATE reviews
    SET search_vector = to_tsvector('italian', coalesce(title, ''))
    WHERE search_vector IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "reviews_search_vector_idx";
    ALTER TABLE "reviews" DROP COLUMN IF EXISTS "search_vector";
    ALTER TABLE "media_works" DROP COLUMN IF EXISTS "watch_status";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "about_page";
  `)
}
