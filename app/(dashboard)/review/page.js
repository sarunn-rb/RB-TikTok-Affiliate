import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import { PageHeading } from "@/components/page-heading";

export const metadata = { title: "App Review Guide" };

const steps = [
  ["Log in", "Use the reviewer credentials supplied in the app review form."],
  ["Connect a TikTok Shop seller", "Open Shop Connection and complete seller authorization on TikTok Shop."],
  ["Open Creators", "Search for a creator by TikTok username or keyword."],
  ["Verify TikTok source data", "Confirm the Shop ID, TikTok request ID, synchronization time, Creator User ID when returned, and Creator Open ID."],
  ["Select the creator", "Choose one returned Creator Marketplace match."],
  ["Open Messages", "The Creator Open ID is carried into the messaging screen."],
  ["Create a conversation", "Create or retrieve the affiliate conversation and confirm conversation_id."],
  ["Send a test affiliate message", "Enter one message and submit it once."],
];

export default function ReviewPage() {
  return <div className="page-shell"><PageHeading title="App Review Guide">Follow this focused test flow to verify seller authorization, creator discovery, data provenance, and one-to-one affiliate messaging.</PageHeading><div className="split"><section className="panel panel-pad"><div className="security-line"><BookOpenCheck size={22} /><div><h2 className="panel-title">Step-by-step product test</h2><p className="panel-copy">Creator records include the source endpoint, TikTok request ID, authorized Shop ID, and synchronization time from the live seller-authorized response.</p></div></div><ol className="review-steps">{steps.map(([title, copy], index) => <li key={title}><span>{index + 1}</span><div><strong>{title}</strong><p>{copy}</p></div></li>)}</ol></section><aside className="stack"><section className="panel panel-pad"><h2 className="panel-title">Start the review</h2><p className="panel-copy">Begin with the seller authorization screen.</p><Link className="btn btn-primary review-start" href="/shop">Open Shop Connection<ArrowRight size={16} /></Link></section><section className="panel panel-pad"><h2 className="panel-title">Current review scope</h2><ul className="plain-list"><li>Shop Authorized Information</li><li>Read Creator Marketplace</li><li>Manage Affiliate Messages</li></ul></section><section className="panel panel-pad"><h2 className="panel-title">Important constraints</h2><ul className="plain-list"><li>One selected creator per message</li><li>No automated or bulk outreach</li><li>No product, order, campaign, promotion, or analytics synchronization</li><li>No fake data or access tokens shown in the UI</li></ul></section></aside></div></div>;
}
