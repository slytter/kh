import type { MetaFunction } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import { Login } from "~/components/Login";
import { OutletContext } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const { session } = useOutletContext<OutletContext>();

  return (
    <div className="container mx-auto h-screen md:w-[800px]">
      {!session?.user && <Login />}
    </div>
  );
}
