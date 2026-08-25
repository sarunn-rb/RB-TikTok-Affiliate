import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/login-form";
import { isReviewerAuthenticated } from "@/lib/auth";

export const metadata = { title: "Reviewer Sign In" };

export default async function LoginPage() {
  if (await isReviewerAuthenticated()) redirect("/");
  return (
    <main className="login-page">
      <section className="login-side">
        <Brand />
        <div className="login-side-content">
          <h2>Creator outreach, with every message intentional.</h2>
          <p>Manage TikTok Shop creator discovery and affiliate conversations through an official seller-authorized workflow.</p>
          <div className="login-workflow" aria-label="Application workflow"><span>Connect Shop</span><span>Find Creator</span><span>Start Conversation</span><span>Send Message</span></div>
        </div>
        <small>Rabbit Bytes Creator Connect · Public App Review POC</small>
      </section>
      <section className="login-main"><LoginForm /></section>
    </main>
  );
}
