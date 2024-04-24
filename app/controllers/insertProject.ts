import { Photo, Project } from "~/store/store";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const insertProjectAndPhotos = async (
  supabase: ReturnType<typeof createSupabaseServerClient>,
  project: Project,
  photos: Photo[],
) => {
  const {
    data: partialProject,
    error: projectError,
    status,
  } = await supabase
    .from("projects")
    .insert({
      name: project.name,
      owner: project.owner,
      generation_props: project.generation_props,
      receivers: project.receivers,
      self_receive: project.self_receive,
      sent_photos_count: project.sent_photos_count,
      photos_count: photos.length,
    })
    .select("id")
    .single();

  console.log({ partialProject, status });
  if (!partialProject) {
    throw new Error("No project created");
  }

  if (projectError) {
    console.error(projectError);
    throw projectError;
  }

  photos = photos.map((photo) => {
    console.log(project.id);
    return {
      ...photo,
      project_id: partialProject.id,
    };
  });

  const { data: photoData, error: photoError } = await supabase
    .from("photos")
    .insert(photos);

  if (photoError) {
    console.error(photoError);
    throw photoError;
  }
};
