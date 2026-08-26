import Link from "next/link";
import { Link2, MessageSquare, Store, Users } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { ConnectButton } from "@/components/shop-actions";
import { getTikTokSession } from "@/lib/session";
import { hasScope, publicConnection } from "@/lib/tiktok/auth";

export default async function OverviewPage() {
  const rawSession = await getTikTokSession();
  const connection = publicConnection(rawSession);
  const capabilities = [
    { name: "Creator Marketplace", icon: Users, active: hasScope(rawSession, "seller.creator_marketplace.read") },
    { name: "Affiliate Messaging", icon: MessageSquare, active: hasScope(rawSession, "seller.affiliate_messages.write") },
  ];
  const steps = [
    ["Connect Shop", "Authorize your TikTok Shop."],
    ["Find Creator", "Search Creator Marketplace."],
    ["Start Conversation", "Create one conversation."],
    ["Send Message", "Send a direct affiliate message."],
  ];

  return (
    <div className="page-shell">
      <PageHeading title="Overview">Connect your TikTok Shop and reach the right creators, one conversation at a time.</PageHeading>
      <div className="stack">
        <section className="panel connection-hero">
          <div className="connection-icon"><Link2 size={31} strokeWidth={1.7} /></div>
          <div><div className="connection-title-line"><h2>TikTok Shop connection</h2><span className={`status ${connection.connected ? "status-success" : "status-neutral"}`}>{connection.connected ? "Connected" : "Not connected"}</span></div><p className="connection-copy">{connection.connected ? `${connection.shop.name}${connection.shop.region ? ` · ${connection.shop.region}` : ""}` : "Connect your TikTok Shop to unlock creator discovery and one-to-one affiliate messaging."}</p></div>
          {connection.connected ? <Link className="btn btn-secondary" href="/shop"><Store size={16} />View connection</Link> : <ConnectButton />}
        </section>
        <section className="panel panel-pad"><h2 className="panel-title">Capabilities</h2><div className="capability-list">{capabilities.map(({ name, icon: Icon, active }) => <div className="capability-row" key={name}><span className="capability-icon"><Icon size={18} /></span><span className="capability-name">{name}</span><span className="capability-state">{!connection.connected ? "Waiting for shop connection" : active ? "Available for this session" : "Scope not granted"}</span></div>)}</div></section>
        <div className="split">
          <section className="panel panel-pad"><h2 className="panel-title">Getting started workflow</h2><div className="workflow">{steps.map(([title, copy], index) => <div className="workflow-step" key={title}><span className="step-number">{index + 1}</span><strong>{title}</strong><p>{copy}</p></div>)}</div></section>
          <section className="panel panel-pad"><h2 className="panel-title">Review checklist</h2><div className="checklist">{["Connect TikTok Shop", "Search one creator", "Create a conversation", "Send a test message"].map((label) => <div className="check-item" key={label}><span className="check-circle" />{label}</div>)}</div></section>
        </div>
      </div>
    </div>
  );
}
