// src/lib/server/schema.ts
import { pgTable,uuid, varchar, integer, json, timestamp, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export const projects = pgTable("projects", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: integer("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  org: varchar("org", { length: 255 }),
  role: varchar("role", { length: 100 }),
  startAt: timestamp("start_at", { mode: "string" }).defaultNow(),
  endAt: timestamp("end_at", { mode: "string" }),
  outcomes: text("outcomes"), // lebih panjang
  techStack: json("tech_stack"),
});
export const projectsRaw = pgTable("projects_raw", {
  id: uuid("id").primaryKey(),
  filename: varchar("filename"),
  fileType: varchar("file_type"),
  rawContent: varchar("raw_content"),
  uploadedAt: timestamp("uploaded_at").defaultNow()
});

export const drafts = pgTable("drafts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: integer("user_id").notNull(),
  kind: varchar("kind", { length: 50 }),
  srcRef: varchar("src_ref", { length: 36 }),
  contentMd: text("content_md"), // biar panjang
  status: varchar("status", { length: 20 }).default("ready"),
  createdAt: timestamp("created_at", { mode: "string" }).default(sql`now()`),
});
