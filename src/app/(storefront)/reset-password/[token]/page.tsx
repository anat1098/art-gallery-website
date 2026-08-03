import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Set New Password",
};

type ResetPasswordPageProps = {
  params: Promise<{ token: string }>;
};

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { token } = await params;

  return (
    <div className="mx-auto max-w-sm px-6 py-20 lg:py-28">
      <h1 className="text-3xl">Set New Password</h1>
      <p className="mt-3 text-muted-foreground">
        Choose a new password for your account.
      </p>
      <div className="mt-10">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
