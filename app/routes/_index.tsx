import type { MetaFunction } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import { Login } from "~/components/auth/Login";
import { OutletContext } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const { session, supabase } = useOutletContext<OutletContext>();

  return (
    <div className="container mx-auto h-screen md:w-[800px]">
      {!session?.user ? (
        <Login />
      ) : (
        <>
          <h1>Welcome to Remix {session.user.email}</h1>
          {/* <button className="btn btn-square" onClick={() => supabase.auth.signOut()}>Logout</a> */}
          <button
            className="btn btn-secondary btn-wide"
            onClick={() => supabase.auth.signOut()}
          >
            Log ud
          </button>
        </>
      )}
    </div>
  );
}
