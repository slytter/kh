import { redirect, useNavigate, useOutletContext } from "@remix-run/react";
import { Container } from "../components/Container";
import { OutletContext } from "../types";
import { Login } from "~/components/auth/Login";
import { useEffect } from "react";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    return redirect("/projects");
  }

  return response;
}

export default function LoginScreen() {
  const { session } = useOutletContext<OutletContext>();

  const navigate = useNavigate();

  useEffect(() => {
    if (session?.user) {
      navigate("/projects/overview");
    }
  }, [session, navigate]);

  return (
    <Container>
      <div className="max-w-md">
        <Login />
      </div>
    </Container>
  );
}
