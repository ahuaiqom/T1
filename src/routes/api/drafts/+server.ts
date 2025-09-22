import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server";
import { drafts } from "$lib/server/schema";

// GET semua draft
export const GET: RequestHandler = async () => {
  const data = await db.select().from(drafts);
  return json(data);
};

// POST buat draft baru
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();

  const newDraft = {
    id: crypto.randomUUID(),
    userId: body.userId,
    kind: body.kind,
    srcRef: body.srcRef,
    contentMd: body.contentMd,
    status: body.status ?? "ready"
  };

  await db.insert(drafts).values(newDraft);

  return json({ message: "Draft created", draft: newDraft });
};
