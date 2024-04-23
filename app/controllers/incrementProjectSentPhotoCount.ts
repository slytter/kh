import { SupabaseClient } from "@supabase/supabase-js";

export async function incrementProjectSentPhotoCount(
  supabase: SupabaseClient,
  projectId: number,
  previousCount: number,
) {
  // Increment and update the count
  const updatedCount = previousCount + 1;
  const { error: updateError } = await supabase
    .from("projects")
    .update({ sent_photos_count: updatedCount })
    .match({ id: projectId });

  if (updateError) {
    throw new Error(
      `Failed to update the project sent count: ${updateError.message}`,
    );
  }
}
