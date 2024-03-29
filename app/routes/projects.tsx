import { LoaderFunctionArgs } from "@remix-run/node";
import { Container } from "~/components/Container";

// should be authed
// otherwise, should be redirected to login page
// fetch projects from server
export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
}

// this
export default function DashBoard() {
  return <Container></Container>;
}
