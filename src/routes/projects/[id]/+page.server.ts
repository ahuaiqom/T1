import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { projects } from "$lib/server/db/schema";
import { eq } from "drizzle-orm/expressions";

export const load: PageServerLoad = async ({ params }) => {
  const project = await db.select().from(projects).where(eq(projects.id, params.id));
  return { project: project[0] };
};
