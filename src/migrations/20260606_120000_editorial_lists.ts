import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Phase 7: editorial lists collection for curated review collections. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_editorial_lists_status" AS ENUM('draft', 'published');

    CREATE TABLE "editorial_lists" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "generate_slug" boolean DEFAULT true,
      "slug" varchar NOT NULL,
      "description" varchar,
      "featured" boolean DEFAULT false,
      "status" "enum_editorial_lists_status" DEFAULT 'draft' NOT NULL,
      "published_at" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "editorial_lists_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "reviews_id" integer
    );

    ALTER TABLE "editorial_lists_rels" ADD CONSTRAINT "editorial_lists_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."editorial_lists"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "editorial_lists_rels" ADD CONSTRAINT "editorial_lists_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;

    CREATE UNIQUE INDEX "editorial_lists_slug_idx" ON "editorial_lists" USING btree ("slug");
    CREATE INDEX "editorial_lists_updated_at_idx" ON "editorial_lists" USING btree ("updated_at");
    CREATE INDEX "editorial_lists_created_at_idx" ON "editorial_lists" USING btree ("created_at");
    CREATE INDEX "editorial_lists_rels_order_idx" ON "editorial_lists_rels" USING btree ("order");
    CREATE INDEX "editorial_lists_rels_parent_idx" ON "editorial_lists_rels" USING btree ("parent_id");
    CREATE INDEX "editorial_lists_rels_path_idx" ON "editorial_lists_rels" USING btree ("path");
    CREATE INDEX "editorial_lists_rels_reviews_id_idx" ON "editorial_lists_rels" USING btree ("reviews_id");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "editorial_lists_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_editorial_lists_fk" FOREIGN KEY ("editorial_lists_id") REFERENCES "public"."editorial_lists"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_editorial_lists_id_idx" ON "payload_locked_documents_rels" USING btree ("editorial_lists_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_editorial_lists_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "editorial_lists_id";

    DROP TABLE IF EXISTS "editorial_lists_rels" CASCADE;
    DROP TABLE IF EXISTS "editorial_lists" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_editorial_lists_status";
  `)
}
