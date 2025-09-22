import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { projects } from "$lib/server/db/schema";


export async function POST({ request }) {
  const body = await request.json();

  

  await db.insert(projects).values({
    id: body.id,
    userId: body.userId,
    title: body.title,
    org: body.org,
    role: body.role,
    outcomes: body.outcomes,
    techStack: body.techStack
  });

  const allProjects = await db.select().from(projects);
  return json(allProjects);
}
