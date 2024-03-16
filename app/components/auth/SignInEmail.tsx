import { AuthError } from "@supabase/supabase-js";
import { ProviderProps } from "./types";
import { Form } from "@remix-run/react";
import { Button, Input } from "@nextui-org/react";

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
      <div className="flex w-full flex-col gap-4 md:flex-nowrap">
        <h1 className="text-2xl font-bold">Log ind</h1>
        <Input
          size="md"
          type="email"
          name="email"
          isRequired
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          name="password"
          isRequired
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" color="primary">
          Log ind
        </Button>
      </div>
    </Form>
  );
};
