import { Clock3, KeyRound, Link2, ShieldCheck, Store } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { ConnectButton, DisconnectButton, ShopSelector } from "@/components/shop-actions";
import { getTikTokSession } from "@/lib/session";
import { publicConnection } from "@/lib/tiktok/auth";

export const metadata = { title: "Shop Connection" };

function formatDate(value) {
  if (!value) return "Not returned";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not returned";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const connection = publicConnection(await getTikTokSession());
  return (
    <div className="page-shell">
      <PageHeading title="Shop Connection">Authorize a seller account and keep its temporary credentials protected in this reviewer session.</PageHeading>
      <div className="stack">
        {params?.connected === "1" && <div className="notice notice-success"><ShieldCheck size={18} />TikTok Shop connected successfully.</div>}
        {params?.error && <div className="notice notice-error" role="alert">{params.error}</div>}
        {!connection.connected ? (
          <section className="panel connection-hero"><div className="connection-icon"><Link2 size={30} /></div><div><div className="connection-title-line"><h2>No TikTok Shop connected</h2><span className="status status-neutral">Not connected</span></div><p className="connection-copy">The seller will be redirected to TikTok Shop to approve the scopes configured in Partner Center.</p></div><ConnectButton /></section>
        ) : (
          <>
            <section className="panel panel-pad"><div className="connection-title-line"><span className="connection-icon"><Store size={29} /></span><div><h2>{connection.shop.name}</h2><span className="status status-success">Connected</span></div></div><dl className="detail-list"><div className="detail-row"><dt>Shop market</dt><dd>{connection.shop.region || "Not returned"}</dd></div><div className="detail-row"><dt>Seller type</dt><dd>{connection.shop.sellerType || "Not returned"}</dd></div><div className="detail-row"><dt>Shop ID</dt><dd>{connection.shop.id || "Not returned"}</dd></div><div className="detail-row"><dt>Shop cipher</dt><dd className="mono">{connection.shop.maskedCipher}</dd></div><div className="detail-row"><dt>Access token expires</dt><dd>{formatDate(connection.accessTokenExpiresAt)}</dd></div><div className="detail-row"><dt>Connected</dt><dd>{formatDate(connection.connectedAt)}</dd></div></dl><ShopSelector shops={connection.authorizedShops} /><div className="connection-actions"><ConnectButton reconnect /><DisconnectButton /></div></section>
            <section className="panel panel-pad"><div className="security-line"><KeyRound size={20} /><div><h2 className="panel-title">Credential protection</h2><p className="panel-copy">Full access tokens, refresh tokens, and app secrets are never rendered in the browser. The temporary token session is encrypted and stored in an HTTP-only cookie.</p></div></div></section>
          </>
        )}
        <div className="notice"><Clock3 size={17} />Access tokens are refreshed server-side when they are near expiry and a valid refresh token is available.</div>
      </div>
    </div>
  );
}
