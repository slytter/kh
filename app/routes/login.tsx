import { useOutletContext } from "@remix-run/react";
import { Container } from "~/components/Container";
import { OutletContext } from "~/types";

export default function Login() {
  const { session, supabase } = useOutletContext<OutletContext>();

  return (
    <Container>
      {!session?.user ? (
        <Login />
      ) : (
        <>
          <h1>Welcome to Remix {session.user.user_metadata.name}</h1>
          <button
            className="btn btn-secondary btn-wide"
            onClick={() => supabase.auth.signOut()}
          >
            Log ud
          </button>
        </>
      )}
    </Container>
  );
}
