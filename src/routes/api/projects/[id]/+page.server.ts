import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const res = await fetch(`/api/projects/${params.id}`);
  const project = await res.json();
  return { project };
};
