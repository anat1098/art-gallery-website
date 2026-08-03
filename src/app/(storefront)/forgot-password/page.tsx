import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-20 lg:py-28">
      <h1 className="text-3xl">Reset Password</h1>
      <p className="mt-3 text-muted-foreground">
        Enter your email and we&apos;ll send you a link to reset your
        password.
      </p>
      <div className="mt-10">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
