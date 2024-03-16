import { Form } from "@remix-run/react";
import { AuthError } from "@supabase/supabase-js";
import { useState } from "react";
import { ProviderProps } from "./types";
import { Button, Input } from "@nextui-org/react";

export const SignUpSection = (props: ProviderProps) => {
  const { setError, email, password, setEmail, setPassword, auth } = props;

  const [dispayName, setDisplayName] = useState("");

  const emailSignUp = async (email: string, password: string) => {
    console.log({ email, password });
    try {
      const result = await auth.signUp({
        email,
        password,
        options: {
          data: {
            name: dispayName,
          },
        },
      });
      auth.updateUser({
        data: {
          name: dispayName,
          display_name: dispayName,
        },
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
    await emailSignUp(email, password);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Ny bruger</h1>
        <Input
          type="text"
          name="name"
          label="Navn"
          value={dispayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
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
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" color="primary">
          Sign up
        </Button>
      </div>
    </Form>
  );
};
