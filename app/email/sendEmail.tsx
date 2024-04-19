import { Photo, Project } from "~/store/store";
import axios from "axios";
import PhotoEmail from "../../react-email/emails/DailyPhoto";
import { renderEmail } from "./renderEmail";
import { render } from "@react-email/render";

const brevoKey = process.env.BREVO_API_KEY;

export async function sendEmail(emails: string[], content: string) {
  for (const email of emails) {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Kh",
          email: "nikolaj@heymor.dk",
        },
        to: [
          {
            email: email,
            name: "Mama",
          },
        ],
        subject: "Dit daglige billede fra Niko 💘",
        htmlContent: content,
      },
      {
        headers: {
          Accept: "application/json",
          "api-key": brevoKey,
          "Content-Type": "application/json",
        },
      },
    );
  }
}

export async function sendEmailToProject(project: Project, photo: Photo) {
  const emailHtml = render(
    <PhotoEmail
      imageNumber={0}
      imageSource={""}
      numImages={23}
      senderName={project.owner}
      userMail=""
    />,
  );

  await sendEmail(project.receivers, emailHtml);
}
