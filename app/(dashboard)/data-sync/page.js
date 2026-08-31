import { PageHeading } from "@/components/page-heading";
import { TikTokDataSync } from "@/components/tiktok-data-sync";
import { getTikTokSession } from "@/lib/session";
import { hasScope } from "@/lib/tiktok/auth";

export const metadata = { title: "TikTok Shop Data Sync" };

export default async function DataSyncPage() {
  const session = await getTikTokSession();
  return (
    <div className="page-shell">
      <PageHeading title="TikTok Shop Data Sync">Synchronize read-only product and order records, then verify the exact TikTok Shop IDs and request provenance.</PageHeading>
      <TikTokDataSync connected={Boolean(session?.shop?.cipher)} productScope={hasScope(session, "seller.product.basic")} orderScope={hasScope(session, "seller.order.info")} />
    </div>
  );
}
