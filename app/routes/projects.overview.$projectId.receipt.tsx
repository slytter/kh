import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const validatedParams = z
    .object({
      projectId: z.string(),
    })
    .parse(params);

  return json({
    projectId: validatedParams.projectId,
  });
}

export default function ProjectReceipt() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Receipt {data.projectId}</h1>
    </div>
  )
}