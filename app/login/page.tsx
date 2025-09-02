"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { z } from "zod";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const schema = z.object({
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(5, "Password must be at least 5 characters"),
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const parseResult = schema.safeParse({ email, password });
    if (!parseResult.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      for (const issue of parseResult.error.issues) {
        const key = issue.path[0] as "email" | "password";
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    // Call Saleor GraphQL tokenCreate API
    const BASE_URL = "https://saleor.kombee.co.in";
    const mutation = `mutation TokenCreate($email: String!, $password: String!) {\n  tokenCreate(email: $email, password: $password) {\n    token\n    user { email }\n    errors { field message }\n  }\n}`;

    setSubmitting(true);
    setFormError(null);
    fetch(`${BASE_URL}/graphql/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: mutation,
        variables: { email, password },
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Network error: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const result = json?.data?.tokenCreate;
        const token: string | undefined = result?.token;
        const apiErrors: Array<{ field?: string; message: string }> =
          result?.errors ?? [];

        if (token) {
          login(token, email.split("@")[0]);
          router.push("/products");
        } else if (apiErrors.length > 0) {
          setFormError("Please enter valid credentials");
        } else {
          setFormError("Login failed. Please try again.");
        }
      })
      .catch((err) => {
        setFormError(err.message || "Unexpected error. Please try again.");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-white text-black p-8 shadow-lg rounded-lg w-96"
      >
        <h1 className="text-2xl font-bold mb-2">Login</h1>
        <p className="text-sm text-gray-600 mb-4">
          Use demo credentials:{" "}
          <span className="font-mono">admin1@example.com</span> /{" "}
          <span className="font-mono">admin</span>
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-red-600 text-sm -mt-3 mb-4">
            {errors.email}
          </p>
        )}

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-6 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <p id="password-error" className="text-red-600 text-sm -mt-5 mb-6">
            {errors.password}
          </p>
        )}

        {formError && <p className="text-red-600 text-sm mb-4">{formError}</p>}

        <button
          className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
        <Link href="/signup">Signup</Link>
      </form>
    </div>
  );
}
