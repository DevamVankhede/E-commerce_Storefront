"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useAuth } from "@/context/AuthProvider"; // Corrected import path

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth(); // Added useAuth hook

  const schema = z
    .object({
      email: z
        .string()
        .min(1, "Email is required")
        .email("Enter a valid email"),
      password: z
        .string()
        .min(1, "Password is required")
        .min(5, "Password must be at least 5 characters"),
      confirmPassword: z.string().min(1, "Confirm Password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setFormError(null);
    setSubmitting(true);

    const parseResult = schema.safeParse({ email, password, confirmPassword });
    if (!parseResult.success) {
      const fieldErrors: {
        email?: string;
        password?: string;
        confirmPassword?: string;
      } = {};
      for (const issue of parseResult.error.issues) {
        const key = issue.path[0] as "email" | "password" | "confirmPassword";
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setSubmitting(false);
      return;
    }

    const BASE_URL = "https://saleor.kombee.co.in";
    const mutation = `mutation AccountRegister($email: String!, $password: String!) {
      accountRegister(input: { email: $email, password: $password }) {
        user { email }
        errors { field message }
      }
    }`;

    setSubmitting(true);

    try {
      const response = await fetch(`${BASE_URL}/graphql/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Saleor-API-Url": BASE_URL,
        },
        body: JSON.stringify({
          query: mutation,
          variables: { email, password },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.errors?.[0]?.message || "Signup failed. Please try again."
        );
      }

      const data = await response.json();
      const user = data.data.accountRegister.user;
      const errors = data.data.accountRegister.errors;

      if (user) {
        console.log("Signup successful:", { email });
        // Automatically log in the user after successful registration
        const loginMutation = `mutation TokenCreate($email: String!, $password: String!) {
          tokenCreate(email: $email, password: $password) {
            token
            user { email }
            errors { field message }
          }
        }`;

        const loginResponse = await fetch(`${BASE_URL}/graphql/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: loginMutation,
            variables: { email, password },
          }),
        });

        const loginData = await loginResponse.json();
        const loginResult = loginData?.data?.tokenCreate;
        const token: string | undefined = loginResult?.token;
        const loginErrors: Array<{ field?: string; message: string }> =
          loginResult?.errors ?? [];

        if (token && loginResult?.user?.email) {
          login(token, loginResult.user.email.split("@")[0]); // Using email prefix as username
          router.push("/products");
        } else {
          setFormError(
            loginErrors?.[0]?.message ||
              "Automatic login failed after registration. Please try to log in manually."
          );
        }
      } else {
        throw new Error(
          errors?.[0]?.message || "Signup failed. Please try again."
        );
      }
    } catch (error: unknown) {
      setFormError(
        (error instanceof Error
          ? error.message
          : "An unknown error occurred") || "Signup failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSignup}
        className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 shadow-xl rounded-lg w-full max-w-md border border-gray-200 dark:border-gray-700"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

        {formError && (
          <p className="text-red-600 dark:text-red-400 text-sm mb-4 text-center">
            {formError}
          </p>
        )}

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="your@example.com"
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            disabled={submitting}
          />
          {errors.email && (
            <p id="email-error" className="text-red-600 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            disabled={submitting}
          />
          {errors.password && (
            <p id="password-error" className="text-red-600 text-sm mt-1">
              {errors.password}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="••••••••"
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword ? "confirmPassword-error" : undefined
            }
            disabled={submitting}
          />
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="text-red-600 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-3 rounded-md font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-300 disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
