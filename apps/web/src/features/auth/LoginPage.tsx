import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/common/ErrorState";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  if (admin) return <Navigate to="/dashboard" replace />;

  const submit = async (values: LoginValues) => {
    setError("");
    try {
      await login(values.email, values.password);
      navigate("/dashboard", { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Login failed");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <form onSubmit={handleSubmit(submit)} className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">SurveyFlow</h1>
        <p className="mt-1 text-sm text-neutral-500">Sign in to manage surveys</p>
        {error ? <div className="mt-4"><ErrorState message={error} /></div> : null}
        <label className="mt-6 block text-sm font-medium">
          Email
          <input
            type="email"
            autoComplete="email"
            className="mt-2 h-10 w-full rounded-md border border-neutral-300 px-3"
            {...register("email")}
          />
        </label>
        {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email.message}</p> : null}
        <label className="mt-4 block text-sm font-medium">
          Password
          <input
            type="password"
            autoComplete="current-password"
            className="mt-2 h-10 w-full rounded-md border border-neutral-300 px-3"
            {...register("password")}
          />
        </label>
        {errors.password ? <p className="mt-1 text-sm text-red-600">{errors.password.message}</p> : null}
        <Button className="mt-6 w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </main>
  );
}
