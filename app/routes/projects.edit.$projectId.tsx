import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getProjectById } from "~/controllers/getProjectById";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { z } from "zod";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const validatedParams = z
    .object({
      projectId: z.string(),
    })
    .parse(params);

  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const projectId = validatedParams.projectId;
  try {
    const project = await getProjectById(supabase, Number(projectId));
    return json({
      project,
    });

  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 401 });
  }
}

export function action() {
  return json({ message: "Project updated" }, { status: 200 });
}

export default function EditProject() {
  const data = useLoaderData<typeof loader>();
  
  return (
    <>
      <h1>Edit Project2</h1>
      <p>{JSON.stringify(data)}</p>
    </>
  );
}
