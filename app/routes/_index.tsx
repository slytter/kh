import type { MetaFunction } from "@remix-run/node";
import { Container } from "~/components/Container";
import Notification from "../assets/notification.svg";
import { NavBotton } from "~/components/Button";

export const meta: MetaFunction = () => {
  return [
    { title: "kh.dk" },
    { name: "description", content: "Et minde hver dag til én du holder af" },
  ];
};

export default function Index() {
  return (
    <Container>
      <div className="flex h-full flex-1 flex-col content-center justify-between pb-8">
        <div />
        <h1 className="text-center text-4xl font-bold md:text-7xl">
          Et minde hver dag <br /> til én du holder af
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
        <NavBotton route="/create/upload" title="Vælg fotos" />
      </div>
    </Container>
  );
}
