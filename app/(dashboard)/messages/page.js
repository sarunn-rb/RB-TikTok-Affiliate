import { PageHeading } from "@/components/page-heading";
import { MessageComposer } from "@/components/message-composer";
import { getTikTokSession } from "@/lib/session";

export const metadata = { title: "Messages" };

export default async function MessagesPage({ searchParams }) {
  const params = await searchParams;
  const session = await getTikTokSession();
  return <div className="page-shell"><PageHeading title="Messages">Create or retrieve one creator conversation, then send one intentional affiliate message.</PageHeading><MessageComposer connected={Boolean(session?.shop?.cipher)} initialCreator={params?.creator || ""} initialUsername={params?.username || ""} /></div>;
}
