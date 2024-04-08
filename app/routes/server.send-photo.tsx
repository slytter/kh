import { LoaderFunctionArgs, json } from "@remix-run/node";
import dayjs from "dayjs";
import { getProjectById } from "~/controllers/getProjectById";
import { sendEmailToProject } from "~/controllers/server.sendEmail";
import { createSuperbaseAdmin } from "~/utils/supabase.server";

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

    for (const photo of photos) {
      const projectId = photo.project_id;
      const project = projectId && (await getProjectById(supabase, projectId));
      if (!project) continue; // Skip if project not found

      // Assuming sendEmailToProject is an async function you've defined
      // that takes project details and the photo to send emails.
      await sendEmailToProject(project, photo);

      // Mark the photo as sent by updating 'did_send' to true
      const { error: updateError } = await supabase
        .from("photos")
        .update({ did_send: false })
        .match({ id: photo.id });

      if (updateError) {
        console.error(`Failed to update photo status: ${updateError.message}`);
        // Handle error appropriately
      }
    }

    return json({ type: "success", message: "Photos processed successfully" });
  } catch (error) {
    console.error(error);
    return json({ message: "An error occurred" }, { status: 500 });
  }
};
