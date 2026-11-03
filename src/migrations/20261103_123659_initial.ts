import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en');
  CREATE TYPE "public"."enum_social_posts_slides_color" AS ENUM('brown', 'cream', 'yellow', 'blue');
  CREATE TYPE "public"."enum_social_posts_slides_layout" AS ENUM('cover', 'signal');
  CREATE TYPE "public"."enum_social_posts_category" AS ENUM('Presença digital', 'Posicionamento', 'Sites & experiência', 'Petasus por perto');
  CREATE TYPE "public"."enum_social_posts_color" AS ENUM('brown', 'cream', 'yellow', 'blue');
  CREATE TYPE "public"."enum_social_posts_format" AS ENUM('Post estático', 'Carrossel');
  CREATE TYPE "public"."enum_social_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__social_posts_v_version_slides_color" AS ENUM('brown', 'cream', 'yellow', 'blue');
  CREATE TYPE "public"."enum__social_posts_v_version_slides_layout" AS ENUM('cover', 'signal');
  CREATE TYPE "public"."enum__social_posts_v_version_category" AS ENUM('Presença digital', 'Posicionamento', 'Sites & experiência', 'Petasus por perto');
  CREATE TYPE "public"."enum__social_posts_v_version_color" AS ENUM('brown', 'cream', 'yellow', 'blue');
  CREATE TYPE "public"."enum__social_posts_v_version_format" AS ENUM('Post estático', 'Carrossel');
  CREATE TYPE "public"."enum__social_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__social_posts_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_social_highlights_stories_color" AS ENUM('brown', 'cream', 'yellow', 'blue');
  CREATE TYPE "public"."enum_social_highlights_icon" AS ENUM('pegasus', 'spark', 'layers', 'grid', 'palette', 'arrow', 'heart', 'instagram', 'bookmark');
  CREATE TYPE "public"."enum_social_highlights_color" AS ENUM('brown', 'cream', 'yellow', 'blue');
  CREATE TYPE "public"."enum_social_highlights_category" AS ENUM('Presença digital', 'Posicionamento', 'Sites & experiência', 'Petasus por perto');
  CREATE TYPE "public"."enum_social_highlights_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__social_highlights_v_version_stories_color" AS ENUM('brown', 'cream', 'yellow', 'blue');
  CREATE TYPE "public"."enum__social_highlights_v_version_icon" AS ENUM('pegasus', 'spark', 'layers', 'grid', 'palette', 'arrow', 'heart', 'instagram', 'bookmark');
  CREATE TYPE "public"."enum__social_highlights_v_version_color" AS ENUM('brown', 'cream', 'yellow', 'blue');
  CREATE TYPE "public"."enum__social_highlights_v_version_category" AS ENUM('Presença digital', 'Posicionamento', 'Sites & experiência', 'Petasus por perto');
  CREATE TYPE "public"."enum__social_highlights_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__social_highlights_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum_payload_llm_instructions_entity_type" AS ENUM('collection', 'global');
  CREATE TABLE "admins_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "admins" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "admins_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"_h_folders_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"original_filename" varchar,
  	"original_url" varchar,
  	"original_mime_type" varchar,
  	"original_filesize" numeric,
  	"original_width" numeric,
  	"original_height" numeric,
  	"original_prefix" varchar,
  	"original__objectkey" varchar,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "media_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"admins_id" integer
  );
  
  CREATE TABLE "_media_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_alt" varchar NOT NULL,
  	"version__h_folders_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version_original_filename" varchar,
  	"version_original_url" varchar,
  	"version_original_mime_type" varchar,
  	"version_original_filesize" numeric,
  	"version_original_width" numeric,
  	"version_original_height" numeric,
  	"version_original_prefix" varchar,
  	"version_original__objectkey" varchar,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_media_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"admins_id" integer
  );
  
  CREATE TABLE "folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_h_folders_id" integer,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "folders_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_folders_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__h_folders_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_folders_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_h_tags_id" integer,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_tags_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__h_tags_id" integer,
  	"version_name" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_tags_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "social_posts_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"accent" varchar,
  	"body" varchar,
  	"label" varchar,
  	"color" "enum_social_posts_slides_color",
  	"layout" "enum_social_posts_slides_layout" DEFAULT 'cover'
  );
  
  CREATE TABLE "social_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"accent" varchar,
  	"subtitle" varchar,
  	"label" varchar,
  	"category" "enum_social_posts_category",
  	"color" "enum_social_posts_color" DEFAULT 'brown',
  	"format" "enum_social_posts_format" DEFAULT 'Post estático',
  	"caption" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"source_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_social_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "social_posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_social_posts_v_version_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"accent" varchar,
  	"body" varchar,
  	"label" varchar,
  	"color" "enum__social_posts_v_version_slides_color",
  	"layout" "enum__social_posts_v_version_slides_layout" DEFAULT 'cover',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_social_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_accent" varchar,
  	"version_subtitle" varchar,
  	"version_label" varchar,
  	"version_category" "enum__social_posts_v_version_category",
  	"version_color" "enum__social_posts_v_version_color" DEFAULT 'brown',
  	"version_format" "enum__social_posts_v_version_format" DEFAULT 'Post estático',
  	"version_caption" varchar,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_source_key" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__social_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"published_locale" "enum__social_posts_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_social_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "social_highlights_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"accent" varchar,
  	"body" varchar,
  	"color" "enum_social_highlights_stories_color" DEFAULT 'yellow'
  );
  
  CREATE TABLE "social_highlights" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"icon" "enum_social_highlights_icon" DEFAULT 'spark',
  	"color" "enum_social_highlights_color" DEFAULT 'yellow',
  	"category" "enum_social_highlights_category",
  	"sort_order" numeric DEFAULT 0,
  	"source_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_social_highlights_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "social_highlights_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_social_highlights_v_version_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"accent" varchar,
  	"body" varchar,
  	"color" "enum__social_highlights_v_version_stories_color" DEFAULT 'yellow',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_social_highlights_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_icon" "enum__social_highlights_v_version_icon" DEFAULT 'spark',
  	"version_color" "enum__social_highlights_v_version_color" DEFAULT 'yellow',
  	"version_category" "enum__social_highlights_v_version_category",
  	"version_sort_order" numeric DEFAULT 0,
  	"version_source_key" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__social_highlights_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"published_locale" "enum__social_highlights_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_social_highlights_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer,
  	"media_id" integer,
  	"folders_id" integer,
  	"tags_id" integer,
  	"social_posts_id" integer,
  	"social_highlights_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_llm_instructions" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity_slug" varchar NOT NULL,
  	"entity_type" "enum_payload_llm_instructions_entity_type" NOT NULL,
  	"additional_instructions" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_llm_instructions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "studio_profile" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"bio" varchar,
  	"instagram_posts" numeric,
  	"followers" numeric,
  	"following" numeric,
  	"avatar_id" integer,
  	"emblem_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "studio_profile_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  CREATE TABLE "_studio_profile_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_name" varchar,
  	"version_bio" varchar,
  	"version_instagram_posts" numeric,
  	"version_followers" numeric,
  	"version_following" numeric,
  	"version_avatar_id" integer,
  	"version_emblem_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_studio_profile_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" integer
  );
  
  ALTER TABLE "admins_sessions" ADD CONSTRAINT "admins_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_rels" ADD CONSTRAINT "admins_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_rels" ADD CONSTRAINT "admins_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media__h_folders_id_folders_id_fk" FOREIGN KEY ("_h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_parent_id_media_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_version__h_folders_id_folders_id_fk" FOREIGN KEY ("version__h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "folders" ADD CONSTRAINT "folders__h_folders_id_folders_id_fk" FOREIGN KEY ("_h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "folders_rels" ADD CONSTRAINT "folders_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "folders_rels" ADD CONSTRAINT "folders_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_folders_v" ADD CONSTRAINT "_folders_v_parent_id_folders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_folders_v" ADD CONSTRAINT "_folders_v_version__h_folders_id_folders_id_fk" FOREIGN KEY ("version__h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_folders_v_rels" ADD CONSTRAINT "_folders_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_folders_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_folders_v_rels" ADD CONSTRAINT "_folders_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags" ADD CONSTRAINT "tags__h_tags_id_tags_id_fk" FOREIGN KEY ("_h_tags_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v" ADD CONSTRAINT "_tags_v_parent_id_tags_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tags_v" ADD CONSTRAINT "_tags_v_version__h_tags_id_tags_id_fk" FOREIGN KEY ("version__h_tags_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tags_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_posts_slides" ADD CONSTRAINT "social_posts_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_posts_rels" ADD CONSTRAINT "social_posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."social_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_posts_rels" ADD CONSTRAINT "social_posts_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_social_posts_v_version_slides" ADD CONSTRAINT "_social_posts_v_version_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_social_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_social_posts_v" ADD CONSTRAINT "_social_posts_v_parent_id_social_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."social_posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_social_posts_v_rels" ADD CONSTRAINT "_social_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_social_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_social_posts_v_rels" ADD CONSTRAINT "_social_posts_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_highlights_stories" ADD CONSTRAINT "social_highlights_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_highlights_rels" ADD CONSTRAINT "social_highlights_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."social_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_highlights_rels" ADD CONSTRAINT "social_highlights_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_social_highlights_v_version_stories" ADD CONSTRAINT "_social_highlights_v_version_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_social_highlights_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_social_highlights_v" ADD CONSTRAINT "_social_highlights_v_parent_id_social_highlights_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."social_highlights"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_social_highlights_v_rels" ADD CONSTRAINT "_social_highlights_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_social_highlights_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_social_highlights_v_rels" ADD CONSTRAINT "_social_highlights_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_folders_fk" FOREIGN KEY ("folders_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_social_posts_fk" FOREIGN KEY ("social_posts_id") REFERENCES "public"."social_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_social_highlights_fk" FOREIGN KEY ("social_highlights_id") REFERENCES "public"."social_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_llm_instructions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "studio_profile" ADD CONSTRAINT "studio_profile_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "studio_profile" ADD CONSTRAINT "studio_profile_emblem_id_media_id_fk" FOREIGN KEY ("emblem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "studio_profile_rels" ADD CONSTRAINT "studio_profile_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."studio_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "studio_profile_rels" ADD CONSTRAINT "studio_profile_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_studio_profile_v" ADD CONSTRAINT "_studio_profile_v_version_avatar_id_media_id_fk" FOREIGN KEY ("version_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_studio_profile_v" ADD CONSTRAINT "_studio_profile_v_version_emblem_id_media_id_fk" FOREIGN KEY ("version_emblem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_studio_profile_v_rels" ADD CONSTRAINT "_studio_profile_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_studio_profile_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_studio_profile_v_rels" ADD CONSTRAINT "_studio_profile_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "admins_sessions_order_idx" ON "admins_sessions" USING btree ("_order");
  CREATE INDEX "admins_sessions_parent_id_idx" ON "admins_sessions" USING btree ("_parent_id");
  CREATE INDEX "admins_updated_at_idx" ON "admins" USING btree ("updated_at");
  CREATE INDEX "admins_created_at_idx" ON "admins" USING btree ("created_at");
  CREATE UNIQUE INDEX "admins_email_idx" ON "admins" USING btree ("email");
  CREATE INDEX "admins_rels_order_idx" ON "admins_rels" USING btree ("order");
  CREATE INDEX "admins_rels_parent_idx" ON "admins_rels" USING btree ("parent_id");
  CREATE INDEX "admins_rels_path_idx" ON "admins_rels" USING btree ("path");
  CREATE INDEX "admins_rels_admins_id_idx" ON "admins_rels" USING btree ("admins_id");
  CREATE INDEX "media__h_folders_idx" ON "media" USING btree ("_h_folders_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_original_original_filename_idx" ON "media" USING btree ("original_filename");
  CREATE INDEX "media_rels_order_idx" ON "media_rels" USING btree ("order");
  CREATE INDEX "media_rels_parent_idx" ON "media_rels" USING btree ("parent_id");
  CREATE INDEX "media_rels_path_idx" ON "media_rels" USING btree ("path");
  CREATE INDEX "media_rels_tags_id_idx" ON "media_rels" USING btree ("tags_id");
  CREATE INDEX "media_rels_admins_id_idx" ON "media_rels" USING btree ("admins_id");
  CREATE INDEX "_media_v_parent_idx" ON "_media_v" USING btree ("parent_id");
  CREATE INDEX "_media_v_version_version__h_folders_idx" ON "_media_v" USING btree ("version__h_folders_id");
  CREATE INDEX "_media_v_version_version_updated_at_idx" ON "_media_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_v_version_version_created_at_idx" ON "_media_v" USING btree ("version_created_at");
  CREATE INDEX "_media_v_version_version_filename_idx" ON "_media_v" USING btree ("version_filename");
  CREATE INDEX "_media_v_version_original_version_original_filename_idx" ON "_media_v" USING btree ("version_original_filename");
  CREATE INDEX "_media_v_created_at_idx" ON "_media_v" USING btree ("created_at");
  CREATE INDEX "_media_v_updated_at_idx" ON "_media_v" USING btree ("updated_at");
  CREATE INDEX "_media_v_rels_order_idx" ON "_media_v_rels" USING btree ("order");
  CREATE INDEX "_media_v_rels_parent_idx" ON "_media_v_rels" USING btree ("parent_id");
  CREATE INDEX "_media_v_rels_path_idx" ON "_media_v_rels" USING btree ("path");
  CREATE INDEX "_media_v_rels_tags_id_idx" ON "_media_v_rels" USING btree ("tags_id");
  CREATE INDEX "_media_v_rels_admins_id_idx" ON "_media_v_rels" USING btree ("admins_id");
  CREATE INDEX "folders__h_folders_idx" ON "folders" USING btree ("_h_folders_id");
  CREATE INDEX "folders_updated_at_idx" ON "folders" USING btree ("updated_at");
  CREATE INDEX "folders_created_at_idx" ON "folders" USING btree ("created_at");
  CREATE INDEX "folders_rels_order_idx" ON "folders_rels" USING btree ("order");
  CREATE INDEX "folders_rels_parent_idx" ON "folders_rels" USING btree ("parent_id");
  CREATE INDEX "folders_rels_path_idx" ON "folders_rels" USING btree ("path");
  CREATE INDEX "folders_rels_admins_id_idx" ON "folders_rels" USING btree ("admins_id");
  CREATE INDEX "_folders_v_parent_idx" ON "_folders_v" USING btree ("parent_id");
  CREATE INDEX "_folders_v_version_version__h_folders_idx" ON "_folders_v" USING btree ("version__h_folders_id");
  CREATE INDEX "_folders_v_version_version_updated_at_idx" ON "_folders_v" USING btree ("version_updated_at");
  CREATE INDEX "_folders_v_version_version_created_at_idx" ON "_folders_v" USING btree ("version_created_at");
  CREATE INDEX "_folders_v_created_at_idx" ON "_folders_v" USING btree ("created_at");
  CREATE INDEX "_folders_v_updated_at_idx" ON "_folders_v" USING btree ("updated_at");
  CREATE INDEX "_folders_v_rels_order_idx" ON "_folders_v_rels" USING btree ("order");
  CREATE INDEX "_folders_v_rels_parent_idx" ON "_folders_v_rels" USING btree ("parent_id");
  CREATE INDEX "_folders_v_rels_path_idx" ON "_folders_v_rels" USING btree ("path");
  CREATE INDEX "_folders_v_rels_admins_id_idx" ON "_folders_v_rels" USING btree ("admins_id");
  CREATE INDEX "tags__h_tags_idx" ON "tags" USING btree ("_h_tags_id");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "tags_rels_order_idx" ON "tags_rels" USING btree ("order");
  CREATE INDEX "tags_rels_parent_idx" ON "tags_rels" USING btree ("parent_id");
  CREATE INDEX "tags_rels_path_idx" ON "tags_rels" USING btree ("path");
  CREATE INDEX "tags_rels_admins_id_idx" ON "tags_rels" USING btree ("admins_id");
  CREATE INDEX "_tags_v_parent_idx" ON "_tags_v" USING btree ("parent_id");
  CREATE INDEX "_tags_v_version_version__h_tags_idx" ON "_tags_v" USING btree ("version__h_tags_id");
  CREATE INDEX "_tags_v_version_version_updated_at_idx" ON "_tags_v" USING btree ("version_updated_at");
  CREATE INDEX "_tags_v_version_version_created_at_idx" ON "_tags_v" USING btree ("version_created_at");
  CREATE INDEX "_tags_v_created_at_idx" ON "_tags_v" USING btree ("created_at");
  CREATE INDEX "_tags_v_updated_at_idx" ON "_tags_v" USING btree ("updated_at");
  CREATE INDEX "_tags_v_rels_order_idx" ON "_tags_v_rels" USING btree ("order");
  CREATE INDEX "_tags_v_rels_parent_idx" ON "_tags_v_rels" USING btree ("parent_id");
  CREATE INDEX "_tags_v_rels_path_idx" ON "_tags_v_rels" USING btree ("path");
  CREATE INDEX "_tags_v_rels_admins_id_idx" ON "_tags_v_rels" USING btree ("admins_id");
  CREATE INDEX "social_posts_slides_order_idx" ON "social_posts_slides" USING btree ("_order");
  CREATE INDEX "social_posts_slides_parent_id_idx" ON "social_posts_slides" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "social_posts_source_key_idx" ON "social_posts" USING btree ("source_key");
  CREATE INDEX "social_posts_updated_at_idx" ON "social_posts" USING btree ("updated_at");
  CREATE INDEX "social_posts_created_at_idx" ON "social_posts" USING btree ("created_at");
  CREATE INDEX "social_posts__status_idx" ON "social_posts" USING btree ("_status");
  CREATE INDEX "social_posts_rels_order_idx" ON "social_posts_rels" USING btree ("order");
  CREATE INDEX "social_posts_rels_parent_idx" ON "social_posts_rels" USING btree ("parent_id");
  CREATE INDEX "social_posts_rels_path_idx" ON "social_posts_rels" USING btree ("path");
  CREATE INDEX "social_posts_rels_admins_id_idx" ON "social_posts_rels" USING btree ("admins_id");
  CREATE INDEX "_social_posts_v_version_slides_order_idx" ON "_social_posts_v_version_slides" USING btree ("_order");
  CREATE INDEX "_social_posts_v_version_slides_parent_id_idx" ON "_social_posts_v_version_slides" USING btree ("_parent_id");
  CREATE INDEX "_social_posts_v_parent_idx" ON "_social_posts_v" USING btree ("parent_id");
  CREATE INDEX "_social_posts_v_version_version_source_key_idx" ON "_social_posts_v" USING btree ("version_source_key");
  CREATE INDEX "_social_posts_v_version_version_updated_at_idx" ON "_social_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_social_posts_v_version_version_created_at_idx" ON "_social_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_social_posts_v_version_version__status_idx" ON "_social_posts_v" USING btree ("version__status");
  CREATE INDEX "_social_posts_v_created_at_idx" ON "_social_posts_v" USING btree ("created_at");
  CREATE INDEX "_social_posts_v_updated_at_idx" ON "_social_posts_v" USING btree ("updated_at");
  CREATE INDEX "_social_posts_v_published_locale_idx" ON "_social_posts_v" USING btree ("published_locale");
  CREATE INDEX "_social_posts_v_latest_idx" ON "_social_posts_v" USING btree ("latest");
  CREATE INDEX "_social_posts_v_rels_order_idx" ON "_social_posts_v_rels" USING btree ("order");
  CREATE INDEX "_social_posts_v_rels_parent_idx" ON "_social_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_social_posts_v_rels_path_idx" ON "_social_posts_v_rels" USING btree ("path");
  CREATE INDEX "_social_posts_v_rels_admins_id_idx" ON "_social_posts_v_rels" USING btree ("admins_id");
  CREATE INDEX "social_highlights_stories_order_idx" ON "social_highlights_stories" USING btree ("_order");
  CREATE INDEX "social_highlights_stories_parent_id_idx" ON "social_highlights_stories" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "social_highlights_source_key_idx" ON "social_highlights" USING btree ("source_key");
  CREATE INDEX "social_highlights_updated_at_idx" ON "social_highlights" USING btree ("updated_at");
  CREATE INDEX "social_highlights_created_at_idx" ON "social_highlights" USING btree ("created_at");
  CREATE INDEX "social_highlights__status_idx" ON "social_highlights" USING btree ("_status");
  CREATE INDEX "social_highlights_rels_order_idx" ON "social_highlights_rels" USING btree ("order");
  CREATE INDEX "social_highlights_rels_parent_idx" ON "social_highlights_rels" USING btree ("parent_id");
  CREATE INDEX "social_highlights_rels_path_idx" ON "social_highlights_rels" USING btree ("path");
  CREATE INDEX "social_highlights_rels_admins_id_idx" ON "social_highlights_rels" USING btree ("admins_id");
  CREATE INDEX "_social_highlights_v_version_stories_order_idx" ON "_social_highlights_v_version_stories" USING btree ("_order");
  CREATE INDEX "_social_highlights_v_version_stories_parent_id_idx" ON "_social_highlights_v_version_stories" USING btree ("_parent_id");
  CREATE INDEX "_social_highlights_v_parent_idx" ON "_social_highlights_v" USING btree ("parent_id");
  CREATE INDEX "_social_highlights_v_version_version_source_key_idx" ON "_social_highlights_v" USING btree ("version_source_key");
  CREATE INDEX "_social_highlights_v_version_version_updated_at_idx" ON "_social_highlights_v" USING btree ("version_updated_at");
  CREATE INDEX "_social_highlights_v_version_version_created_at_idx" ON "_social_highlights_v" USING btree ("version_created_at");
  CREATE INDEX "_social_highlights_v_version_version__status_idx" ON "_social_highlights_v" USING btree ("version__status");
  CREATE INDEX "_social_highlights_v_created_at_idx" ON "_social_highlights_v" USING btree ("created_at");
  CREATE INDEX "_social_highlights_v_updated_at_idx" ON "_social_highlights_v" USING btree ("updated_at");
  CREATE INDEX "_social_highlights_v_published_locale_idx" ON "_social_highlights_v" USING btree ("published_locale");
  CREATE INDEX "_social_highlights_v_latest_idx" ON "_social_highlights_v" USING btree ("latest");
  CREATE INDEX "_social_highlights_v_rels_order_idx" ON "_social_highlights_v_rels" USING btree ("order");
  CREATE INDEX "_social_highlights_v_rels_parent_idx" ON "_social_highlights_v_rels" USING btree ("parent_id");
  CREATE INDEX "_social_highlights_v_rels_path_idx" ON "_social_highlights_v_rels" USING btree ("path");
  CREATE INDEX "_social_highlights_v_rels_admins_id_idx" ON "_social_highlights_v_rels" USING btree ("admins_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_admins_id_idx" ON "payload_locked_documents_rels" USING btree ("admins_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("folders_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_social_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("social_posts_id");
  CREATE INDEX "payload_locked_documents_rels_social_highlights_id_idx" ON "payload_locked_documents_rels" USING btree ("social_highlights_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_admins_id_idx" ON "payload_preferences_rels" USING btree ("admins_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "payload_llm_instructions_entity_slug_idx" ON "payload_llm_instructions" USING btree ("entity_slug");
  CREATE INDEX "payload_llm_instructions_updated_at_idx" ON "payload_llm_instructions" USING btree ("updated_at");
  CREATE INDEX "payload_llm_instructions_created_at_idx" ON "payload_llm_instructions" USING btree ("created_at");
  CREATE INDEX "payload_llm_instructions_rels_order_idx" ON "payload_llm_instructions_rels" USING btree ("order");
  CREATE INDEX "payload_llm_instructions_rels_parent_idx" ON "payload_llm_instructions_rels" USING btree ("parent_id");
  CREATE INDEX "payload_llm_instructions_rels_path_idx" ON "payload_llm_instructions_rels" USING btree ("path");
  CREATE INDEX "payload_llm_instructions_rels_admins_id_idx" ON "payload_llm_instructions_rels" USING btree ("admins_id");
  CREATE INDEX "studio_profile_avatar_idx" ON "studio_profile" USING btree ("avatar_id");
  CREATE INDEX "studio_profile_emblem_idx" ON "studio_profile" USING btree ("emblem_id");
  CREATE INDEX "studio_profile_rels_order_idx" ON "studio_profile_rels" USING btree ("order");
  CREATE INDEX "studio_profile_rels_parent_idx" ON "studio_profile_rels" USING btree ("parent_id");
  CREATE INDEX "studio_profile_rels_path_idx" ON "studio_profile_rels" USING btree ("path");
  CREATE INDEX "studio_profile_rels_admins_id_idx" ON "studio_profile_rels" USING btree ("admins_id");
  CREATE INDEX "_studio_profile_v_version_version_avatar_idx" ON "_studio_profile_v" USING btree ("version_avatar_id");
  CREATE INDEX "_studio_profile_v_version_version_emblem_idx" ON "_studio_profile_v" USING btree ("version_emblem_id");
  CREATE INDEX "_studio_profile_v_created_at_idx" ON "_studio_profile_v" USING btree ("created_at");
  CREATE INDEX "_studio_profile_v_updated_at_idx" ON "_studio_profile_v" USING btree ("updated_at");
  CREATE INDEX "_studio_profile_v_rels_order_idx" ON "_studio_profile_v_rels" USING btree ("order");
  CREATE INDEX "_studio_profile_v_rels_parent_idx" ON "_studio_profile_v_rels" USING btree ("parent_id");
  CREATE INDEX "_studio_profile_v_rels_path_idx" ON "_studio_profile_v_rels" USING btree ("path");
  CREATE INDEX "_studio_profile_v_rels_admins_id_idx" ON "_studio_profile_v_rels" USING btree ("admins_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "admins_sessions" CASCADE;
  DROP TABLE "admins" CASCADE;
  DROP TABLE "admins_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_rels" CASCADE;
  DROP TABLE "_media_v" CASCADE;
  DROP TABLE "_media_v_rels" CASCADE;
  DROP TABLE "folders" CASCADE;
  DROP TABLE "folders_rels" CASCADE;
  DROP TABLE "_folders_v" CASCADE;
  DROP TABLE "_folders_v_rels" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "tags_rels" CASCADE;
  DROP TABLE "_tags_v" CASCADE;
  DROP TABLE "_tags_v_rels" CASCADE;
  DROP TABLE "social_posts_slides" CASCADE;
  DROP TABLE "social_posts" CASCADE;
  DROP TABLE "social_posts_rels" CASCADE;
  DROP TABLE "_social_posts_v_version_slides" CASCADE;
  DROP TABLE "_social_posts_v" CASCADE;
  DROP TABLE "_social_posts_v_rels" CASCADE;
  DROP TABLE "social_highlights_stories" CASCADE;
  DROP TABLE "social_highlights" CASCADE;
  DROP TABLE "social_highlights_rels" CASCADE;
  DROP TABLE "_social_highlights_v_version_stories" CASCADE;
  DROP TABLE "_social_highlights_v" CASCADE;
  DROP TABLE "_social_highlights_v_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "payload_llm_instructions" CASCADE;
  DROP TABLE "payload_llm_instructions_rels" CASCADE;
  DROP TABLE "studio_profile" CASCADE;
  DROP TABLE "studio_profile_rels" CASCADE;
  DROP TABLE "_studio_profile_v" CASCADE;
  DROP TABLE "_studio_profile_v_rels" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_social_posts_slides_color";
  DROP TYPE "public"."enum_social_posts_slides_layout";
  DROP TYPE "public"."enum_social_posts_category";
  DROP TYPE "public"."enum_social_posts_color";
  DROP TYPE "public"."enum_social_posts_format";
  DROP TYPE "public"."enum_social_posts_status";
  DROP TYPE "public"."enum__social_posts_v_version_slides_color";
  DROP TYPE "public"."enum__social_posts_v_version_slides_layout";
  DROP TYPE "public"."enum__social_posts_v_version_category";
  DROP TYPE "public"."enum__social_posts_v_version_color";
  DROP TYPE "public"."enum__social_posts_v_version_format";
  DROP TYPE "public"."enum__social_posts_v_version_status";
  DROP TYPE "public"."enum__social_posts_v_published_locale";
  DROP TYPE "public"."enum_social_highlights_stories_color";
  DROP TYPE "public"."enum_social_highlights_icon";
  DROP TYPE "public"."enum_social_highlights_color";
  DROP TYPE "public"."enum_social_highlights_category";
  DROP TYPE "public"."enum_social_highlights_status";
  DROP TYPE "public"."enum__social_highlights_v_version_stories_color";
  DROP TYPE "public"."enum__social_highlights_v_version_icon";
  DROP TYPE "public"."enum__social_highlights_v_version_color";
  DROP TYPE "public"."enum__social_highlights_v_version_category";
  DROP TYPE "public"."enum__social_highlights_v_version_status";
  DROP TYPE "public"."enum__social_highlights_v_published_locale";
  DROP TYPE "public"."enum_payload_llm_instructions_entity_type";`)
}
