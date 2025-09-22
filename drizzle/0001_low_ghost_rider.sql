ALTER TABLE "drafts" ALTER COLUMN "content_md" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "outcomes" SET DATA TYPE text;