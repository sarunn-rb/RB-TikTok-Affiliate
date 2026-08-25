"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Login failed.");
      setPending(false);
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <form className="login-form" onSubmit={submit}>
      <div className="login-lock" aria-hidden="true"><LockKeyhole size={20} /></div>
      <div>
        <h1>Reviewer sign in</h1>
        <p>Use the credentials provided with the TikTok Shop App Review submission.</p>
      </div>
      <div className="field"><label htmlFor="username">Username</label><input className="input" id="username" name="username" autoComplete="username" required maxLength={100} /></div>
      <div className="field"><label htmlFor="password">Password</label><input className="input" id="password" name="password" type="password" autoComplete="current-password" required maxLength={256} /></div>
      {error && <div className="notice notice-error" role="alert">{error}</div>}
      <button className="btn btn-primary login-submit" disabled={pending}>
        {pending ? <LoaderCircle className="spin" size={17} /> : <ArrowRight size={17} />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="login-security">Your session is protected by an encrypted HTTP-only cookie.</p>
    </form>
  );
}
