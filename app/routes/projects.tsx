import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container } from "~/components/Container";
import { ProjectCard } from "~/components/ProjectCard";
import { ProjectDescription } from "~/components/ProjectDescription";
import { getPhotosByProjectId } from "~/controllers/getPhtotosByProjectId";
import { getProjectsFromOwner } from "~/controllers/getProjectsFromOwner";
import { Photo } from "~/store/store";
import { createSupabaseServerClient } from "~/utils/supabase.server";

// should be authed
// otherwise, should be redirected to login page
// fetch projects from server
export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return redirect("/login");
  }

  try {
    const projects = await getProjectsFromOwner(supabase, data.user.id);

    const photoPromises = projects.map((project) =>
      getPhotosByProjectId(supabase, project.id),
    );

    const photos = await Promise.all(photoPromises);

    return json({ projects, photos });
  } catch (error) {
    console.error(error);
    return json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// this
export default function DashBoard() {
  const { projects, photos } = useLoaderData<typeof loader>();

  return (
    <Container>
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-gray-800">Dine projekter</h1>

        <ul className="flex flex-shrink-0 flex-col gap-4">
          {projects.map((project, i) => (
            <ProjectCard
              project={{ ...project, name: `Projekt ${i + 1}` }}
              photos={photos[i]}
            />
          ))}
        </ul>
      </div>
    </Container>
  );
}
