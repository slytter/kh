import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface PhotoEmailProps {
  imageSource: string;
  imageNumber: number;
  numImages: number;
  userMail: string;
  senderName: string;
  message?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const PhotoEmail = ({
  imageSource,
  imageNumber,
  numImages,
  senderName,
  userMail,
  message,
}: PhotoEmailProps) => (
  <Html>
    <Head>
      <Font
        fontFamily="inter"
        fallbackFontFamily="Helvetica"
        webFont={{
          url: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
          format: "woff2",
        }}
        fontWeight={400}
        fontStyle="normal"
      />
    </Head>
    <Preview>Dit daglige minde fra kh.dk</Preview>
    <Tailwind>
      <Body style={main}>
        <Container style={container}>
          <Link href="https://kh-eta.vercel.app/" target="_blank">
            <Img
              src={`${baseUrl}/static/kh.png`}
              width="32"
              style={{ marginTop: 16 }}
              alt="Notion's Logo"
            />
          </Link>
          <Text
            style={{ ...text, fontWeight: 600, margin: "0", marginTop: 16 }}
          >
            Billede {imageNumber} af {numImages}
          </Text>
          <Text style={{ ...text, marginBottom: "8px" }}>"{message}"</Text>
          <Img
            src={imageSource}
            alt="Dagens billede"
            width="100%"
            height="auto"
            className="rounded-xl"
            style={{
              marginBottom: "16px",
            }}
          />
          <Section className="text-center mt-[16px] mb-[16px]">
            <Button
              className="bg-[#000000] rounded-xl text-white text-[14px] font-semibold no-underline text-center px-8 py-3"
              href={"https://kh-eta.vercel.app/projects"}
            >
              Se alle fotos
            </Button>
          </Section>

          <Link href="https://kh-eta.vercel.app/" target="_blank">
            <Img
              src={`${baseUrl}/static/kh.png`}
              width="32"
              alt="Notion's Logo"
            />
          </Link>
          <Text style={footer}>
            <Link
              href="https://kh-eta.vercel.app/"
              target="_blank"
              style={{ ...link, color: "#898989" }}
            >
              kh.dk
            </Link>{" "}
            – et minde hver dag, til en du holder af 💘
            <br />
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

PhotoEmail.PreviewProps = {
  imageSource: "https://images.unsplash.com/photo-1713288971538-80084dbfc161",
  imageNumber: 1,
  numImages: 52,
  userMail: "ns@wayer.io",
  senderName: "Nikolaj Schlüter",
  message: "Dengang vi var i Italien",
} as PhotoEmailProps;

export default PhotoEmail;

const main: React.CSSProperties = {
  backgroundColor: "#ffffff",
};

const container: React.CSSProperties = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto",
};

const link: React.CSSProperties = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont,'inter' 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  textDecoration: "underline",
};

const text: React.CSSProperties = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "16px",
  textAlign: "center",
  margin: "0",
};

const footer: React.CSSProperties = {
  color: "#898989",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};
