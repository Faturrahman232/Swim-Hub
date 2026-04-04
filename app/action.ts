"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";

// 🟢 SIGN UP ACTION
export const signUpAction = async (formData: FormData) => {
  const fullName = formData.get("fullName")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const agreeTerms = formData.get("agreeTerms") === "on";

  const origin = headers().get("origin") ?? "http://localhost:3000";
  const supabase = await createClient();

  // Validation
  if (!fullName || !email || !password || !confirmPassword) {
    return encodedRedirect("error", "/register", "All fields are required.");
  }

  if (password !== confirmPassword) {
    return encodedRedirect("error", "/register", "Passwords do not match.");
  }

  if (!agreeTerms) {
    return encodedRedirect("error", "/register", "You must agree to the terms.");
  }

  if (password.length < 8) {
    return encodedRedirect("error", "/register", "Password must be at least 8 characters.");
  }

  // Create user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        name: fullName,
        role: "customer", // custom metadata
      },
    },
  });

  if (error) {
    console.error("Signup Error:", error.message);
    return encodedRedirect("error", "/register", "Database error saving new user");
  }

  return encodedRedirect(
    "success",
    "/login",
    "Account created! Please check your email to verify your account."
  );
};

// 🟢 SIGN IN ACTION
export const signInAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return encodedRedirect("error", "/login", "Email and password are required");
  }

  const cookieStore = cookies();
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return encodedRedirect("error", "/login", error.message);
  }

  return redirect("/dashboard");
};

// 🟢 FORGOT PASSWORD
export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const origin = headers().get("origin") ?? "http://localhost:3000";
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const cookieStore = cookies();
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect("error", "/forgot-password", "Could not reset password");
  }

  if (callbackUrl) return redirect(callbackUrl);

  return encodedRedirect("success", "/forgot-password", "Check your email for a reset link.");
};

// 🟢 RESET PASSWORD
export const resetPasswordAction = async (formData: FormData) => {
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!password || !confirmPassword) {
    return encodedRedirect("error", "/reset-password", "All fields are required.");
  }

  if (password !== confirmPassword) {
    return encodedRedirect("error", "/reset-password", "Passwords do not match.");
  }

  const cookieStore = cookies();
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return encodedRedirect("error", "/reset-password", "Failed to update password.");
  }

  return encodedRedirect("success", "/login", "Password updated. Please login again.");
};

// 🟢 SIGN OUT
export const signOutAction = async () => {
  const cookieStore = cookies();
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};
