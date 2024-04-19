import { render } from "@react-email/render";

export const renderEmail = (Email: React.ReactElement) => {
  const emailHtml = render(Email);
  return emailHtml;
};
