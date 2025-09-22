import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { drafts } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

// GET /api/drafts/:id → ambil draft by id
export async function GET({ params }) {
  const data = await db.select().from(drafts).where(eq(drafts.id, params.id));
  return json(data[0] ?? { message: "Not found" });
}

// PUT /api/drafts/:id → update draft
export async function PUT({ params, request }) {
  const body = await request.json();
  await db.update(drafts).set(body).where(eq(drafts.id, params.id));
  return json({ message: `Draft ${params.id} updated ✅` });
}

// DELETE /api/drafts/:id → hapus draft
export async function DELETE({ params }) {
  await db.delete(drafts).where(eq(drafts.id, params.id));
  return json({ message: `Draft ${params.id} deleted ❌` });
}
