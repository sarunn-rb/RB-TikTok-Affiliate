import { PageHeading } from "@/components/page-heading";
import { CreatorSearch } from "@/components/creator-search";
import { getTikTokSession } from "@/lib/session";

export const metadata = { title: "Creators" };

export default async function CreatorsPage() {
  const session = await getTikTokSession();
  return <div className="page-shell"><PageHeading title="Creators">Search TikTok Shop Creator Marketplace by username or keyword, then select one creator to message.</PageHeading><CreatorSearch connected={Boolean(session?.shop?.cipher)} /></div>;
}
