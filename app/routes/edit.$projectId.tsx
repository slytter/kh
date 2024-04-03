import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Container } from "~/components/Container";
import { getProjectById } from "~/controllers/getProjectById";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { z } from "zod";
import { useLoaderData, useSubmit } from "@remix-run/react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const validatedParams = z
    .object({
      projectId: z.string(),
    })
    .parse(params);

  const projectId = validatedParams.projectId;

  const response = new Response();

  const supabase = createSupabaseServerClient({ request, response });

  console.time("getProjectById");
  const project = await getProjectById(supabase, Number(projectId));
  console.timeEnd("getProjectById");

  return json({
    project,
  });
}

export function action() {
  return json({ message: "Project updated" }, { status: 200 });
}

export default function EditProject() {
  const data = useLoaderData<typeof loader>();
  const submit = useSubmit();

  return (
    <Container>
      <h1>Edit Project</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Container>
  );
}
