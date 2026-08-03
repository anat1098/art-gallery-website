import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log In",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-20 lg:py-28">
      <h1 className="text-3xl">Log In</h1>
      <p className="mt-3 text-muted-foreground">
        Welcome back. Log in to view your orders and account details.
      </p>
      <div className="mt-10">
        <LoginForm />
      </div>
    </div>
  );
}
