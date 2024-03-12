import { AuthError } from "@supabase/supabase-js";
import { ProviderProps } from "./types";
import { Form } from "@remix-run/react";

export const SignInSection = (props: ProviderProps) => {
  const { setError, email, password, setEmail, setPassword, auth } = props;

  const emailSignIn = async (email: string, password: string) => {
    console.log({ email, password });
    try {
      const result = await auth.signInWithPassword({
        email,
        password,
      });

      if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error);
      } else {
        setError({
          name: "Unknown error",
          status: 400,
          message: "Unknown error",
        } as AuthError);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    await emailSignIn(email, password);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Log ind</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input input-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input input-primary"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-wide">
          Sign in
        </button>
      </div>
    </Form>
  );
};
