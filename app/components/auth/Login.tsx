import { useMatches } from "@remix-run/react";
import { AuthError } from "@supabase/supabase-js";
import { useState, useMemo } from "react";
import { SignInSection } from "./SignInEmail";
import { SignUpSection } from "./SignUpEmail";
import { Button } from "@nextui-org/react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";

type Props = {
  defaultSignState?: "login" | "signup";
  message?: string;
};

export const Login = (props: Props) => {
  const { defaultSignState, message } = props;
  
  // Get env from root loader to create supabase client
  const matches = useMatches();
  const rootData = matches.find((match) => match.id === "root")?.data as
    | { env?: { SUPABASE_URL: string; SUPABASE_PUBLIC_KEY: string } }
    | undefined;
  
  // Create supabase client if env is available (memoized to avoid recreating)
  const supabase = useMemo(() => {
    if (!rootData?.env) return null;
    return createBrowserClient(
      rootData.env.SUPABASE_URL,
      rootData.env.SUPABASE_PUBLIC_KEY
    );
  }, [rootData?.env]);
  
  const [email, setEmail] = useState("");
  const [error, setError] = useState<AuthError | null>(null);
  const [password, setPassword] = useState("");
  const [signState, setSignState] = useState<"login" | "signup">(
    defaultSignState || "login",
  );
  
  if (!supabase) {
    return <div>Loading...</div>;
  }

  // const googleLogin = () => {
  //   supabase.auth.signInWithOAuth({
  //     provider: "google",
  //   });
  //   supabase.auth.onAuthStateChange((event, session) => {
  //     console.log({ event, session });
  //   });
  // };

  const switchSignState = () => {
    setPassword("");
    setSignState(signState === "login" ? "signup" : "login");
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4 pb-4 pt-4">
      <div className="flex w-full flex-col space-y-4">
        {signState === "login" ? (
          <SignInSection
            auth={supabase.auth}
            setError={setError}
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            message={message}
          />
        ) : (
          <SignUpSection
            auth={supabase.auth}
            setError={setError}
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
          />
        )}
        <Button
          type="button"
          onClick={switchSignState}
          className="btn btn-ghost btn-sm"
        >
          {signState === "login" ? "Ingen bruger?" : "Allerede bruger?"}
        </Button>
      </div>

      {/* <button className="btn btn-secondary btn-wide" onClick={googleLogin}>
        Google (Need auth keys to work)
      </button> */}
      <div className="text-red-500">{error?.message}</div>
    </div>
  );
};
