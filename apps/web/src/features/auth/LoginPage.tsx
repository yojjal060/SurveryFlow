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
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-6 py-12">
      <form onSubmit={handleSubmit(submit)} className="w-full max-w-md rounded-2xl border border-neutral-200/80 bg-white p-7 shadow-[0_20px_60px_rgba(23,23,23,0.08)] sm:p-9">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-xs font-semibold text-white">SF</div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">SurveyFlow</h1>
            <p className="text-sm text-neutral-500">Admin workspace</p>
          </div>
        </div>
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
