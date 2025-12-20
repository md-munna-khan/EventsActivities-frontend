"use client";
import { loginUser } from "@/services/auth/loginUser";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import InputFieldError from "./shared/InputFieldError";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

const LoginForm = ({ redirect }: { redirect?: string }) => {
  const [state, formAction, isPending] = useActionState(loginUser, null);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      {/* Quick-fill credentials for testing/demo */}
      <div className="mb-4 flex gap-2  mx-auto justify-center">
        <Button
          type="button"
          variant="default"
          onClick={() => {
            const e = emailRef.current;
            const p = passwordRef.current;
            if (e) e.value = "munnamia0200@gmail.com";
            if (p) p.value = "Admin@12345";
          }}
        >
          Admin
        </Button>

        <Button
          type="button"
          variant="default"
          onClick={() => {
            const e = emailRef.current;
            const p = passwordRef.current;
            if (e) e.value = "host@gmail.com";
            if (p) p.value = "123456";
          }}
        >
          Host
        </Button>

        <Button
          type="button"
          variant="default"
          onClick={() => {
            const e = emailRef.current;
            const p = passwordRef.current;
            if (e) e.value = "user@gmail.com";
            if (p) p.value = "123456";
          }}
        >
          Client
        </Button>
      </div>
      {redirect && <input type="hidden" name="redirect" value={redirect} />}
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4">
          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              ref={emailRef}
              //   required
            />

            <InputFieldError field="email" state={state} />
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              ref={passwordRef}
              //   required
            />
            <InputFieldError field="password" state={state} />
          </Field>
        </div>
        <FieldGroup className="mt-4">
          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </Button>

            <FieldDescription className="px-6 text-center">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </FieldDescription>
            <FieldDescription className="px-6 text-center">
              <a
                href="/forget-password"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;
