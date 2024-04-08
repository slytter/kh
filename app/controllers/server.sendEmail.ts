import { Photo, Project } from "~/store/store";
import axios from "axios";

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

    console.log(response.data);
  }
}

export function sendEmailToProject(project: Project, photo: Photo) {
  const content = `
  <h1>Hej ${project.name}!</h1>
  <p>Her er dit daglige billede fra Niko:</p>
  <img src="${photo.url}" alt="Dit daglige billede fra Niko" />
  `;

  sendEmail(project.receivers, content);
}
