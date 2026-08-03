import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-20 lg:py-28">
      <h1 className="text-3xl">Create Account</h1>
      <p className="mt-3 text-muted-foreground">
        Save your details for faster checkout and track your orders.
      </p>
      <div className="mt-10">
        <RegisterForm />
      </div>
    </div>
  );
}
