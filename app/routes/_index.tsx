import type { MetaFunction } from "@remix-run/node";
import { Container } from "../components/Container";
import Notification from "../assets/email.noti.svg";
import { NavBotton } from "../components/Button";
import { ImagePlus } from "lucide-react";
import { Background } from "../components/shared/Background";

export const meta: MetaFunction = () => {
  return [
    { title: "kh.dk" },
    { name: "description", content: "Et minde hver dag til én du holder af" },
  ];
};

export default function Index() {
  return (
    <div className="">
      <Background />
      <Container transparentHeader>
        <div className="flex h-full flex-1 flex-col content-center justify-between pb-8">
          <div />
          <h1
            className="text-center text-4xl font-bold md:text-7xl outline-1"
            style={{
              textShadow: "0px 0px 60px rgba(255, 255, 255, 1)",
            }}
          >
            Ét minde hver dag <br /> til én du holder af
          </h1>
          <div className="flex flex-col gap-6">
            <img
              src={Notification}
              alt="Notification"
              className="mx-auto w-full max-w-sm"
            />
            <p className="text-md text-balance text-center md:text-xl">
              Med <b>kh</b>, kan du planlægge daglige eller ugentlige
              billedeoverraskelser til dine nærmeste.
            </p>
          </div>
          <NavBotton
            route="/create/upload"
            title="Vælg fotos"
            startContent={<ImagePlus />}
          />
        </div>
      </Container>
    </div>
  );
}
