import { Html, Button } from "@react-email/components";

type PhotoEmailProps = {
  name: string;
};

export const PhotoEmail = (props: PhotoEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Button href="https://example.com" style={{ color: "#61dafb" }}>
        Click me
      </Button>
    </Html>
  );
};
