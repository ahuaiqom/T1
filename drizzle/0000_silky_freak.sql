CREATE TABLE "drafts" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"kind" varchar(50),
	"src_ref" varchar(36),
	"content_md" varchar(1000),
	"status" varchar(20) DEFAULT 'ready',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" varchar(255),
	"org" varchar(255),
	"role" varchar(100),
	"start_at" timestamp DEFAULT now(),
	"end_at" timestamp,
	"outcomes" varchar(500),
	"tech_stack" json
);
