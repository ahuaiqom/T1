import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db/index";
import { projects } from "$lib/server/db/schema";

export async function GET() {
  const data = await db.select().from(projects);
  return json(data);
}

export async function POST({ request }: { request: Request }) {
  const body = await request.json();

  const newProject = {
    id: crypto.randomUUID(), // ⬅️ ID auto-generate
    userId: body.userId,
    title: body.title,
    org: body.org,
    role: body.role,
    startAt: body.startAt,
    endAt: body.endAt,
    outcomes: body.outcomes,
    techStack: body.techStack,
  };

  await db.insert(projects).values(newProject);

  return json({ message: "Project created ✅", project: newProject });
}
