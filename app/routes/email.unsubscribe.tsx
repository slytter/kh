import { Button } from "@nextui-org/react";
import { LoaderFunctionArgs, ActionFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import { Container } from "~/components/Container";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const supabase = createSupabaseServerClient({ request });
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return json(
      {
        error: { message: "No email provided" },
        isSubscribed: true,
        email: "",
      },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("unsubscribed_emails")
    .select("*")
    .eq("email", email);

  if (!data) {
    return json(
      {
        error: null,
        isSubscribed: true,
        email: "",
      },
      { status: 400 },
    );
  }

  const isSubscribed = !(data.length > 0);
  return json({ isSubscribed: isSubscribed, email, error });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const supabase = createSupabaseServerClient({ request });
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const actionType = formData.get("actionType") as string;

  if (!email) {
    return json({ error: { message: "No email provided" } }, { status: 400 });
  }

  console.log({ email, actionType });
  if (actionType === "unsubscribe") {
    const { error } = await supabase
      .from("unsubscribed_emails")
      .insert([{ email }]);
    return json({ error, message: "Unsubscribed successfully" });
  } else if (actionType === "subscribe") {
    console.log({ email });
    const { error } = await supabase
      .from("unsubscribed_emails")
      .delete()
      .eq("email", email);

    console.log({ error });
    return json({ error, message: "Subscribed successfully" });
  }

  return json({ error: { message: "Invalid action type" } }, { status: 400 });
};

export default function EmailUnsubscribe() {
  const submit = useSubmit();
  const { isSubscribed, email, error } = useLoaderData<typeof loader>();

  const handleSubscriptionToggle = (isUnsubscribed: boolean) => {
    submit(
      {
        email,
        actionType: isUnsubscribed ? "unsubscribe" : "subscribe",
      },
      { method: "post" },
    );
  };

  if (error) {
    return (
      <Container>
        <div className="space-y-2">
          <h1 className="text-2xl">Error</h1>
          <p>{error.message}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          {!isSubscribed ? "Øv :(" : "Afmeld alle dine kærlige hilsner?"}
        </h1>
        <b>{email}</b>
        <p>
          {!isSubscribed ? "Du er ude af kh.dk" : "Vil du afmelde dig fra kh?"}
        </p>
        <Button
          onClick={() => handleSubscriptionToggle(isSubscribed)}
          variant="shadow"
          color={isSubscribed ? "danger" : "default"}
        >
          {!isSubscribed ? "Tilmeld igen" : "Afmeld"}
        </Button>
      </div>
    </Container>
  );
}
