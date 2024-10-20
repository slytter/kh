import { defer, json, LoaderFunctionArgs } from "@remix-run/node";
import { getProjectById } from "~/controllers/getProjectById";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { z } from "zod";
import { Await, useLoaderData } from "@remix-run/react";
import { getPhotosByProjectId } from "~/controllers/getPhtotosByProjectId";
import { Suspense } from "react";
import { HorizontalPhotoOverview } from "~/components/HorizontalPhotoOverview";

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
    const photosPromise = getPhotosByProjectId(supabase, Number(projectId));
    return defer({
      project,
      photos: photosPromise,
    });

  } catch (error) {
    const e = error instanceof Error ? error.message : "Unknown error"
    return json({ error: e }, { status: 401 });
  }
}

export function action() {
  return json({ message: "Project updated" }, { status: 200 });
}

export default function SeeProject() {
  const { project, photos } = useLoaderData<typeof loader>();
  
  return (
    <>
      <h1>See Project2</h1>
      <p>{JSON.stringify(project)}</p>
      <Suspense fallback={<p>Loading photos...</p>}>
        <Await resolve={photos}>
          {(photos) => {
            return <HorizontalPhotoOverview photos={photos} />
          }}
        </Await>
      </Suspense>
    </>
  );
}
