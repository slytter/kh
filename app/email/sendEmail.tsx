import { Photo, Project } from "~/store/store";
import axios from "axios";
import PhotoEmail from "../../react-email/emails/DailyPhoto";
import { render } from "@react-email/render";
import { SupabaseClient } from "@supabase/supabase-js";
import { getUser } from "~/controllers/getUser";

const brevoKey = process.env.BREVO_API_KEY;

type EmailAndContent = {
  email: string;
  content: string;
  sender: string;
  senderName: string;
};

export async function sendEmail(emailsAndContent: EmailAndContent[]) {
  for (const emailAndContent of emailsAndContent) {
    try {
      const res = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: emailAndContent.senderName,
            email: emailAndContent.sender,
          },
          to: [
            {
              email: emailAndContent.email,
              name: emailAndContent.email,
            },
          ],
          subject: `Dit daglige billede fra ${emailAndContent.senderName}`,
          htmlContent: emailAndContent.content,
        },
        {
          headers: {
            Accept: "application/json",
            "api-key": brevoKey,
            "Content-Type": "application/json",
          },
        },
      );

      console.log({ tex: res.statusText });
      console.log(res.data);
    } catch (error) {
      console.log(error);

      throw new Error("Failed to send email");
    }
  }
}

export async function sendEmailToProject(
  supabase: SupabaseClient,
  project: Project,
  photoUrl: string,
) {
  const sender = await getUser(supabase, project.owner);

  const emailsAndContent: EmailAndContent[] = project.receivers.map(
    (receiver) => {
      const emailHtml = render(
        <PhotoEmail
          imageNumber={project.sent_photos_count + 1}
          numImages={project.photos_count}
          imageSource={photoUrl}
          senderName={sender.user_metadata.name}
          userMail={receiver}
        />,
      );

      return {
        email: receiver,
        sender: sender?.email || "kh@kh.dk",
        senderName: sender.user_metadata.name || "Kh",
        content: emailHtml,
      } as EmailAndContent;
    },
  );

  await sendEmail(emailsAndContent);
}
