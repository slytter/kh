import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "./utils/supabase.server";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import { SpeedInsights } from "@vercel/speed-insights/remix";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import stylesheet from "./tailwind.css";
import { NextUIProvider } from "@nextui-org/react";
import * as LR from "@uploadcare/blocks";
import { useProjectStore } from "./store/store";
import "react-day-picker/dist/style.css";
LR.registerBlocks(LR);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_PUBLIC_KEY: process.env.SUPABASE_PUBLIC_KEY!,
  };

  const response = new Response();

  const supabase = createSupabaseServerClient({ request, response });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return json({ env, session }, { headers: response.headers });
};

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  const { env, session } = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();

  const [supabase] = useState(() =>
    createBrowserClient(env.SUPABASE_URL, env.SUPABASE_PUBLIC_KEY),
  );

  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverAccessToken) {
        revalidate();
      }
      const uid = session?.user.id;
      useProjectStore.getState().setOwner(uid || null);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, serverAccessToken, revalidate]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />

        <script src="https://cdn.jsdelivr.net/npm/grained@0.0.2/grained.min.js"></script>
        {/*
        <script
          src="https://cdn.jsdelivr.net/npm/grained@0.0.2/grained.min.js"
          onError={() => console.log("error loading")}
          onLoad={() => {
            var options = {
              animate: true,
              patternWidth: 100,
              patternHeight: 100,
              grainOpacity: 0.5,
              grainDensity: 1,
              grainWidth: 1,
              grainHeight: 1,
            };
            console.log("grained", options);

            grained("#grained", options);
          }}
        /> */}
        <Meta />
        <Links />
      </head>
      <body
      // className="text-foreground bg-background dark"
      >
        <NextUIProvider>
          <main>
            <Outlet context={{ supabase, session }} />
            <SpeedInsights />
            <ScrollRestoration />
            <Scripts />

            <LiveReload />
          </main>
        </NextUIProvider>
      </body>
    </html>
  );
}
