"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileSchema, type ProfileInput } from "@/lib/validation/profile";
import { updateProfile } from "@/server/actions/profile";

export function ProfileForm({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone: string;
}) {
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name, phone },
  });

  async function onSubmit(values: ProfileInput) {
    setSubmitting(true);
    setStatus("idle");
    try {
      const result = await updateProfile(values);
      if (result.ok) {
        setStatus("saved");
      } else {
        setStatus("error");
        setError(result.error);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-5" noValidate>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" className="mt-2" {...form.register("name")} />
        {form.formState.errors.name && (
          <p className="mt-1 text-xs text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled className="mt-2" />
        <p className="mt-1 text-xs text-muted-foreground">
          Contact support to change your email address.
        </p>
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" className="mt-2" {...form.register("phone")} />
      </div>

      {status === "error" && error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {status === "saved" && (
        <p className="text-sm text-brand">Profile updated.</p>
      )}

      <Button type="submit" className="rounded-none" disabled={submitting}>
        {submitting ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
}
