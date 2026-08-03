"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { newsletterSchema, type NewsletterInput } from "@/lib/validation/newsletter";
import { subscribeToNewsletter } from "@/server/actions/newsletter";
import { useLocale } from "@/components/providers/locale-provider";

export function NewsletterForm() {
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: NewsletterInput) {
    startTransition(async () => {
      const result = await subscribeToNewsletter(values);
      if (result.success) {
        setStatus("success");
        setMessage("You're on the list.");
        form.reset();
      } else {
        setStatus("error");
        setMessage(result.message ?? "Something went wrong.");
      }
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-2"
      noValidate
    >
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder={t.common.yourEmail}
          autoComplete="email"
          className="bg-background"
          {...form.register("email")}
        />
        <Button type="submit" variant="default" disabled={isPending}>
          {isPending ? "…" : t.common.join}
        </Button>
      </div>
      {form.formState.errors.email && (
        <p className="text-xs text-destructive">
          {form.formState.errors.email.message}
        </p>
      )}
      {status !== "idle" && !form.formState.errors.email && (
        <p
          className={`text-xs ${status === "success" ? "text-brand" : "text-destructive"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
