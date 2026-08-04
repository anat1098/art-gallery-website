"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";
import { submitContactMessage } from "@/server/actions/contact";
import { useLocale } from "@/components/providers/locale-provider";

export function ContactForm() {
  const { t } = useLocale();
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(values: ContactInput) {
    setSubmitting(true);
    try {
      const result = await submitContactMessage(values);
      if (result.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
        setError(result.error);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "sent") {
    return <p className="text-muted-foreground">{t.contact.sent}</p>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="name">{t.contact.name}</Label>
        <Input id="name" className="mt-2" {...form.register("name")} />
        {form.formState.errors.name && (
          <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email">{t.contact.email}</Label>
        <Input id="email" type="email" className="mt-2" {...form.register("email")} />
        {form.formState.errors.email && (
          <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="subject">{t.contact.subject}</Label>
        <Input id="subject" className="mt-2" {...form.register("subject")} />
        {form.formState.errors.subject && (
          <p className="mt-1 text-xs text-destructive">{form.formState.errors.subject.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="message">{t.contact.message}</Label>
        <Textarea id="message" rows={5} className="mt-2" {...form.register("message")} />
        {form.formState.errors.message && (
          <p className="mt-1 text-xs text-destructive">{form.formState.errors.message.message}</p>
        )}
      </div>

      {status === "error" && error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" className="rounded-none px-8" disabled={submitting}>
        {submitting ? t.contact.sending : t.contact.send}
      </Button>
    </form>
  );
}
