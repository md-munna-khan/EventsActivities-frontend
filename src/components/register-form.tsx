"use client";

import React, { useActionState, useEffect } from "react";
import { toast } from "sonner";
import InputFieldError from "./shared/InputFieldError";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { registerClient } from "@/services/auth/register";

const INTERESTS = [
  "MUSIC","SPORTS","HIKING","TRAVEL","COOKING","READING","DANCING",
  "GAMING","TECHNOLOGY","PHOTOGRAPHY","ART","MOVIES","FITNESS","YOGA",
  "CYCLING","RUNNING","CAMPING","FISHING","LANGUAGES","FOOD",
  "VOLUNTEERING","GARDENING","WRITING","FASHION","BUSINESS","FINANCE",
  "MEDITATION","DIY","PETS","SOCIALIZING","OTHER"
];

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerClient, null);

  useEffect(() => {
    if (state) {
      if (!state.success && state.message) toast.error(state.message);
      if (state.success && state.message) toast.success(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} encType="multipart/form-data">
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input id="name" name="name" type="text" placeholder="John Doe" />
            <InputFieldError field="client.name" state={state} />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" placeholder="m@example.com" />
            <InputFieldError field="client.email" state={state} />
          </Field>

          <Field>
            <FieldLabel htmlFor="contactNumber">Contact Number</FieldLabel>
            <Input id="contactNumber" name="contactNumber" type="text" placeholder="+8801xxxxxxxxx" />
            <InputFieldError field="client.contactNumber" state={state} />
          </Field>

          <Field>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input id="location" name="location" type="text" placeholder="Dhaka, Bangladesh" />
            <InputFieldError field="client.location" state={state} />
          </Field>

          <Field className="md:col-span-2">
            <FieldLabel htmlFor="bio">Bio</FieldLabel>
            <textarea id="bio" name="bio" rows={3} className="w-full rounded-md border px-3 py-2" placeholder="Short bio about yourself" />
            <InputFieldError field="client.bio" state={state} />
          </Field>

          <Field>
            <FieldLabel htmlFor="profilePhoto">Profile Photo</FieldLabel>
            <input id="profilePhoto" name="file" type="file" accept="image/*" />
            <InputFieldError field="client.profilePhoto" state={state} />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" name="password" type="password" />
            <InputFieldError field="password" state={state} />
          </Field>

          <Field className="md:col-span-2">
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <Input id="confirmPassword" name="confirmPassword" type="password" />
            <InputFieldError field="confirmPassword" state={state} />
          </Field>

          <Field className="md:col-span-2">
            <FieldLabel>Interests</FieldLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-auto p-2 border rounded-sm">
              {INTERESTS.map((interest) => (
                <label key={interest} className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" name="interests" value={interest} />
                  <span>{interest.charAt(0) + interest.slice(1).toLowerCase()}</span>
                </label>
              ))}
            </div>
            <InputFieldError field="client.interests" state={state} />
          </Field>
        </div>

        <FieldGroup className="mt-4">
          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>
            <FieldDescription className="px-6 text-center">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign in
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;
