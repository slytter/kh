import type { MetaFunction } from "@remix-run/node";
import { Container } from "../components/Container";
import Notification from "../assets/email.noti.svg";
import { NavBotton } from "../components/Button";
import { ImagePlus, Gift } from "lucide-react";
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

// .

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="">
      <Container transparentHeader>
        <section className="flex h-full flex-1 flex-col content-center justify-between pb-8 items-center">
          <div />
          <div className="flex flex-col items-center space-y-4">
            {/* <RiveAnimation /> */}
            <h1
              className="text-center text-4xl font-bold sm:text-4xl md:text-7xl "
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
            {/* </div>
          <div className="flex flex-col gap-6 items-center"> */}
            {/* <img
              src={Notification}
              alt="Notification"
              className="mx-auto w-full max-w-sm"
            /> */}
            <p className="text-lg text-balance text-center md:text-2xl max-w-82 mix-blend-luminosity">
              {/* Med <span className="neulis">kh</span>, kan du planlægge daglige
              eller ugentlige billedeoverraskelser til dine nærmeste. */}
              Gaven der bliver ved med at give–
              <span className="neulis">kh</span> afsender automatisk dine fotos
              afsted til en email, hver dag eller uge
            </p>
          </div>
          {/* <NavBotton
            route="/create/upload"
            title="Vælg fotos"
            startContent={<ImagePlus />}
          /> */}
          {/* <div
            className="p-4"
            style={{
              // "-webkit-filter": "invert()",
              // backdropFilter: "invert(1) grayscale(100%)",
              mixBlendMode: "color-burn",
              background: "black",
              "-webkit-backdrop-filter": "invert() grayscale()",
              borderRadius: 12,
              // background: "white",
              filter: "contrast(2) brightness(1.2) !important",
            }}
          >
            <span
              className="justify-center flex gap-2 flex-row text-white"
              style={{
                // "-webkit-filter": "invert()",
                filter: "drop-shadow(0px 0px 6px rgba(0, 0, 0, 1)",
                // color: "black",
              }}
            >
              <Gift /> Kom igang
            </span>
          </div> */}
          <Button
            size="lg"
            type={"button"}
            onClick={() => navigate("/explainer")}
            variant="bordered"
            radius="lg"
            className="mx-auto disabled:opacity-20 border-black"
            style={{
              // "-webkit-filter": "invert()",
              "-webkit-backdrop-filter": "invert(1) grayscale(100%)",
              backdropFilter: "invert(1) grayscale(100%)",
              mixBlendMode: "difference",
              // background: "white",
              filter: "contrast(3) brightness(1.5)",
            }}
          >
            <span
              className="justify-center flex gap-2 flex-row text-white"
              style={{
                // "-webkit-filter": "invert()",
                filter: "none",
                // color: "black",
              }}
            >
              <Gift /> Kom igang
            </span>
          </Button>
        </section>
        <section className=""></section>
      </Container>
      <Background />
    </div>
  );
}
