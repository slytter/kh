import { LoaderFunctionArgs, json } from "@remix-run/node";
import dayjs from "dayjs";
import _ from "lodash";
import { getProjectById } from "~/controllers/getProjectById";
import { sendEmailToProject } from "~/email/sendEmail";
import { createSuperbaseAdmin } from "~/utils/supabase.server";

// this loader is requested from https://console.cron-job.org/jobs every 1 hour.
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // todo block this route from being accessed by unauthorized users

    // if (
    //   request.headers.get("Authorization") !==
    //   `Bearer ${process.env.CRON_SECRET}`
    // ) {
    //   const res = new Response(null, { status: 401 });
    //   return res;
    // }

    // Make request for every photo (in photos) there has not been sent (photo.did_sent = false) using supabase
    // Only photos with send_date < now should be sent (using dayjs)
    const supabase = createSuperbaseAdmin();
    const now = dayjs().add(1, "minute");

    let { data: photos, error } = await supabase
      .from("photos")
      .select("*")
      .eq("did_send", false)
      .lte("send_at", now.valueOf());

    // fetch the corrasponding project (using getProjectById) and send it to the emails in the photos

    // console.log({ photos, error });
    if (error) throw new Error(`Failed to fetch photos: ${error.message}`);
    if (!photos || photos.length === 0) {
      return json({ type: "success", message: "No photos to process" });
    }

    let potentialErrorMessages = [] as string[];
    for (const photo of photos) {
      const projectId = photo.project_id;
      const project = projectId && (await getProjectById(supabase, projectId));
      if (!project) continue; // Skip if project not found

      try {
        await sendEmailToProject(supabase, project, photo.url);
        // add +1 to the project's sent_photos_count
        supabase
          .from("projects")
          .update({
            sent_photos_count: project.sent_photos_count + 1,
          })
          .match({ id: project.id });
        // todo
      } catch (error) {
        console.error(`Failed to send email: ${error}`);
        potentialErrorMessages.push(`Failed to send email: ${error}`);
      }

      // Mark the photo as sent by updating 'did_send' to true
      // const { error: updateError } = await supabase
      //   .from("photos")
      //   .update({ did_send: true })
      //   .match({ id: photo.id });

      // if (updateError) {
      //   console.error(`Failed to update photo status: ${updateError.message}`);
      //   potentialErrorMessages.push(
      //     `Failed to update photo status: ${updateError.message}`,
      //   );
      // }
    }

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
  }
};
