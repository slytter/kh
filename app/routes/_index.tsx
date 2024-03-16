import { Button } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { Container } from "~/components/Container";
import Notification from "../assets/notification.svg";

export const meta: MetaFunction = () => {
  return [
    { title: "kh.dk" },
    { name: "description", content: "Et billede hver dag til én du holder af" },
  ];
};

export default function Index() {
  return (
    <Container>
      <div className="flex w-full flex-col content-center justify-between pb-8">
        <div />
        <h1 className="text-center text-4xl font-bold md:text-7xl">
          Et billede hver dag <br /> til én du holder af
        </h1>
        <img src={Notification} alt="Notification" className="mx-auto" />
        <p className="text-md text-balance text-center md:text-xl">
          Med <b>kh</b>, kan du planlægge daglige eller ugentlige
          billedeoverraskelser til dine nærmeste.
        </p>
        <Button color="primary" size="lg" className="mx-auto" prefix="">
          Vælg fotos
        </Button>
      </div>
    </Container>
  );
}
