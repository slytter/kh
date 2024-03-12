import { Form } from "@remix-run/react";
import { AuthError } from "@supabase/supabase-js";
import { useState } from "react";
import { ProviderProps } from "./types";

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
        <input
          type="text"
          name="name"
          placeholder="Navn"
          className="input input-primary"
          value={dispayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
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
          Sign up
        </button>
      </div>
    </Form>
  );
};
