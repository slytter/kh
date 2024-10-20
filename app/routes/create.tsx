import { Outlet, useOutletContext } from "@remix-run/react";
import { Container } from "../components/Container.js";
import { OutletContext } from "~/types.js";

export default function Create() {
  const { session, supabase } = useOutletContext<OutletContext>();

  // apperently its not possible to pass context to nested routes
  // update: why do i do it then?

  return (
    <Container>
      <div className="flex min-h-dvh flex-col gap-8">
        <Outlet context={{ session, supabase }} />
      </div>
    </Container>
  );
}
