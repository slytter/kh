import type { MetaFunction } from "@remix-run/node";
import { Container } from "../components/Container";
import Notification from "../assets/email.noti.svg";
import { NavBotton } from "../components/Button";
import { ImagePlus } from "lucide-react";
import { Background } from "../components/shared/Background";
import { Button } from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";
import { RiveAnimation } from "~/components/RiveAnimation";

export const meta: MetaFunction = () => {
  return [
    { title: "kh.dk" },
    { name: "description", content: "Et minde hver dag til én du holder af" },
  ];
};

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="">
      <Container transparentHeader>
        <div className="flex h-full flex-1 flex-col content-center justify-between pb-8">
          <div />
          <div>
            {/* <RiveAnimation /> */}
            <h1
              className="text-center text-4xl font-bold md:text-7xl outline-1"
              style={{
                // textShadow: "0px 0px 20px rgba(255, 255, 255, 0.6)",
                // filter: "drop-shadow(0px 4px 20px rgba(255, 255, 255, 1)",
                mixBlendMode: "luminosity",
                // color: "white",
                // filter: "contrast(3)",
                // backdropFilter: "grayscale(1)",
              }}
            >
              {/* Ét minde hver dag <br /> til én du holder af */}
              Giv et foto hver dag <br /> til én du holder af
            </h1>
          </div>
          <div className="flex flex-col gap-6">
            {/* <img
              src={Notification}
              alt="Notification"
              className="mx-auto w-full max-w-sm"
            /> */}
            <p className="text-md text-balance text-center md:text-xl">
              Med <span className="neulis">kh</span>, kan du planlægge daglige
              eller ugentlige billedeoverraskelser til dine nærmeste.
            </p>
          </div>
          {/* <NavBotton
            route="/create/upload"
            title="Vælg fotos"
            startContent={<ImagePlus />}
          /> */}
          <Button
            size="lg"
            type={"button"}
            onClick={() => navigate("/create/upload")}
            variant="bordered"
            radius="lg"
            className="mx-auto disabled:opacity-20 border-black backdrop-invert mix-blend-difference backdrop-grayscale"
            style={{
              filter: "contrast(3) brightness(1.5)",
            }}
          >
            <span className="justify-center flex gap-2 flex-row text-white ">
              <ImagePlus /> Vælg fotos
            </span>
          </Button>
        </div>
      </Container>
      <Background />
    </div>
  );
}
