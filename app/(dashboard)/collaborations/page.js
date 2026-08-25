import { Handshake, LockKeyhole } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { getTikTokSession } from "@/lib/session";
import { hasScope } from "@/lib/tiktok/auth";

export const metadata = { title: "Collaborations" };

export default async function CollaborationsPage() {
  const session = await getTikTokSession();
  const featureFlag = process.env.TIKTOK_COLLABORATION_ENABLED === "true";
  const canRead = hasScope(session, "seller.affiliate_collaboration.read");
  const canWrite = hasScope(session, "seller.affiliate_collaboration.write");
  const enabled = featureFlag && (canRead || canWrite);

  return (
    <div className="page-shell"><PageHeading title="Collaborations">Affiliate collaboration controls appear only when the application and seller token have approved scopes.</PageHeading>
      {!enabled ? <section className="panel panel-pad empty-state"><LockKeyhole size={28} /><h2>Affiliate Collaboration API is not enabled for this application.</h2><p>This POC does not simulate collaboration data. Enable the feature only after the required scope is approved in TikTok Shop Partner Center.</p></section>
      : <section className="panel panel-pad"><div className="security-line"><Handshake size={22} /><div><h2 className="panel-title">Approved collaboration scopes detected</h2><p className="panel-copy">Read scope: {canRead ? "granted" : "not granted"}. Manage scope: {canWrite ? "granted" : "not granted"}. Collaboration mutations remain unavailable until the exact product and commission inputs required by the approved endpoint are configured.</p></div></div></section>}
    </div>
  );
}
