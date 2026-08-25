import { CheckCircle2, CircleAlert, Settings2, Shield } from "lucide-react";
import { PageHeading } from "@/components/page-heading";

export const metadata = { title: "Settings" };

function ConfigRow({ label, ready, detail }) {
  return <div className="config-row"><span className={`config-icon ${ready ? "config-ready" : "config-missing"}`}>{ready ? <CheckCircle2 size={18} /> : <CircleAlert size={18} />}</span><div><strong>{label}</strong><span>{detail}</span></div><span className={`status ${ready ? "status-success" : "status-warning"}`}>{ready ? "Configured" : "Missing"}</span></div>;
}

export default function SettingsPage() {
  const config = [
    ["Reviewer credentials", Boolean(process.env.REVIEW_USER && process.env.REVIEW_PASSWORD), "Environment-only app access for TikTok reviewers."],
    ["Encrypted sessions", Boolean(process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32), "SESSION_SECRET must contain at least 32 characters."],
    ["TikTok Shop API", Boolean(process.env.TIKTOK_SHOP_APP_KEY && process.env.TIKTOK_SHOP_APP_SECRET), "Server-side App Key and App Secret."],
    ["Seller authorization", Boolean(process.env.TIKTOK_SHOP_SERVICE_ID), "Service ID from the Partner Center app details page."],
    ["Production callback", Boolean(process.env.TIKTOK_SHOP_REDIRECT_URI), process.env.TIKTOK_SHOP_REDIRECT_URI || "Redirect URI is not configured."],
  ];
  return <div className="page-shell"><PageHeading title="Settings">Configuration readiness is shown without exposing credential values.</PageHeading><div className="split"><section className="panel panel-pad"><div className="security-line"><Settings2 size={21} /><div><h2 className="panel-title">Environment readiness</h2><p className="panel-copy">Values are read only on the server.</p></div></div><div className="config-list">{config.map(([label, ready, detail]) => <ConfigRow key={label} label={label} ready={ready} detail={detail} />)}</div></section><section className="panel panel-pad"><Shield size={24} /><h2 className="panel-title settings-side-title">Security posture</h2><p className="panel-copy">No database, no browser token storage, no bulk messaging, and no client-side TikTok API calls. Disconnecting or logging out removes the temporary TikTok token session.</p></section></div></div>;
}
