import { LoaderFunctionArgs, json } from "@remix-run/node";
import dayjs from "dayjs";
import _ from "lodash";
import { getProjectById } from "~/controllers/getProjectById";
import { sendEmailToProject } from "~/email/sendEmail";
import { createSuperbaseAdmin } from "~/utils/supabase.server";
import { incrementProjectSentPhotoCount } from "../controllers/incrementProjectSentPhotoCount";
import { Photo } from "~/store/store";
import { SupabaseClient } from "@supabase/supabase-js";
import pLimit from "p-limit";

const markPhotoSent = async (supabase: SupabaseClient, photoId: string) => {
  // Mark the photo as sent by updating 'did_send' to true
  const { error: updateError } = await supabase
    .from("photos")
    .update({ did_send: true })
    .match({ id: photoId });

  if (updateError) {
    console.error(`Failed to update photo status: ${updateError.message}`);
    throw new Error(`Failed to update photo status: ${updateError.message}`);
  }
};

const sendPhoto = async (supabase: SupabaseClient, photo: Photo) => {
  const projectId = photo.project_id;
  const project = projectId && (await getProjectById(supabase, projectId, false));
  if (!project || !project.id) return; // Skip if project not found
  await sendEmailToProject(supabase, project, photo.url);
  // add +1 to the project's sent_photos_count
  await incrementProjectSentPhotoCount(
    supabase,
    project.id,
    project.sent_photos_count,
  );
};

// this loader is requested from https://console.cron-job.org/jobs every 1 hour.
export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.time("cron-job");
  try {
    // Make request for every photo (in photos) there has not been sent (photo.did_sent = false) using supabase
    // Only photos with send_date < now should be sent (using dayjs)
    const supabase = createSuperbaseAdmin();
    const now = dayjs().add(1, "minute");

  
    const { data: photos, error } = await supabase
      .from("photos")
      .select("*")
      .eq("did_send", false)
      .lte("send_at", now.valueOf());

    // fetch the corrasponding project (using getProjectById) and send it to the emails in the photos
    if (error) throw new Error(`Failed to fetch photos: ${error.message}`);
    if (!photos || photos.length === 0) {
      return json({ type: "success", message: "No photos to process" });
    }

    const limit = pLimit(5); // Set concurrency limit to 5
    const potentialErrorMessages: string[] = [];

    const sendTasks = photos.map((photo) => { 
      return limit(async () => {
        try {
          await sendPhoto(supabase, photo);
          await markPhotoSent(supabase, photo.id);
        } catch (error) {
          console.error(`Failed to send photo: ${error}`);
          potentialErrorMessages.push(`Failed to send photo: ${error}`);
        }
      });
    });

    // Wait for all the send tasks to complete
    await Promise.all(sendTasks).then(() => {
      console.log("All photos processed");
      if (potentialErrorMessages.length > 0) {
        console.log("Some errors occurred:", potentialErrorMessages);
      }
    });

    if (potentialErrorMessages.length > 0) {
      return json(
        {
          type: "error",
          message: `Some (${potentialErrorMessages.length}) photos failed to process`,
          errors: _.uniq(potentialErrorMessages),
        },
        { status: 500 },
      );
    }

    return json({ type: "success", message: "Photos processed successfully" });
  } catch (error) {
    console.error(error);
    return json({ message: "An error occurred", error }, { status: 500 });
  } finally {
    console.timeEnd("cron-job");
  }
};
