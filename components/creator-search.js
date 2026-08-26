"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, LoaderCircle, MessageSquare, Search, UserRound } from "lucide-react";

function formatCount(value) {
  if (value === null || value === undefined || value === "") return null;
  const count = Number(value);
  return Number.isFinite(count) ? new Intl.NumberFormat("en", { notation: "compact" }).format(count) : String(value);
}

function formatSynchronizedAt(value) {
  if (!value) return "Not returned";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not returned";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function CreatorSearch({ connected }) {
  const [keyword, setKeyword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [creators, setCreators] = useState([]);
  const [source, setSource] = useState(null);

  async function search(event) {
    event.preventDefault();
    if (pending || !keyword.trim()) return;
    setPending(true); setError(""); setSearched(true);
    const response = await fetch("/api/creators/search", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ keyword }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setCreators([]);
      setSource(null);
      setError(data.error || "Creator search failed.");
    } else {
      setCreators(data.creators || []);
      setSource(data.source || null);
    }
    setPending(false);
  }

  if (!connected) {
    return <div className="panel panel-pad empty-state"><UserRound size={28} /><h2>Connect a shop to search creators</h2><p>Creator Marketplace requests require a seller access token and the selected shop cipher.</p><Link className="btn btn-primary" href="/shop">Open Shop Connection</Link></div>;
  }

  return (
    <div className="stack">
      <form className="creator-search-bar" onSubmit={search}>
        <Search size={19} aria-hidden="true" />
        <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Search TikTok username or creator keyword" maxLength={80} aria-label="Creator search keyword" />
        <button className="btn btn-primary" disabled={pending || !keyword.trim()}>{pending ? <LoaderCircle className="spin" size={17} /> : <Search size={17} />}{pending ? "Searching…" : "Search creators"}</button>
      </form>
      <p className="search-note">Results come directly from TikTok Shop Creator Marketplace. Availability and fields vary by market.</p>
      {error && <div className="notice notice-error" role="alert">{error}</div>}
      {source && (
        <section className="panel panel-pad creator-source" aria-label="TikTok Shop data source">
          <div className="creator-source-heading"><BadgeCheck size={21} /><div><h2 className="panel-title">TikTok Shop data verified</h2><p className="panel-copy">These creator records were returned by the authorized TikTok Shop Open API request.</p></div></div>
          <dl className="creator-source-grid">
            <div><dt>Source endpoint</dt><dd><code>{source.endpoint}</code></dd></div>
            <div><dt>TikTok request ID</dt><dd><code>{source.requestId || "Not returned"}</code></dd></div>
            <div><dt>Authorized Shop ID</dt><dd><code>{source.shopId || "Not returned"}</code></dd></div>
            <div><dt>Synchronized</dt><dd>{formatSynchronizedAt(source.synchronizedAt)}</dd></div>
          </dl>
        </section>
      )}
      {searched && !pending && !error && creators.length === 0 && <div className="panel panel-pad empty-state"><Search size={27} /><h2>No matching creators returned</h2><p>Try another username or a broader keyword. Exact username lookup depends on TikTok Shop&apos;s supported search behavior.</p></div>}
      {creators.length > 0 && (
        <div className="creator-table panel">
          <div className="creator-table-head"><span>Creator</span><span>Available profile data</span><span>Action</span></div>
          {creators.map((creator) => (
            <div className="creator-row" key={creator.messageCreatorId}>
              <div className="creator-primary">
                <div className="creator-avatar">
                  {creator.avatar ? <Image src={creator.avatar} alt="" width={44} height={44} sizes="44px" unoptimized /> : <UserRound size={20} />}
                </div>
                <div><strong>{creator.name || creator.username || "TikTok creator"}</strong>{creator.username && <span>@{creator.username.replace(/^@/, "")}</span>}
                  <dl className="creator-identifiers">
                    <div><dt>TikTok Creator User ID</dt><dd><code>{creator.creatorUserId || "Not returned by this endpoint"}</code></dd></div>
                    <div><dt>Creator Open ID</dt><dd><code>{creator.creatorOpenId || "Not returned by this endpoint"}</code></dd></div>
                  </dl>
                </div>
              </div>
              <div className="creator-meta">
                {formatCount(creator.followers) && <span>{formatCount(creator.followers)} followers</span>}
                {creator.category && <span>{typeof creator.category === "string" ? creator.category : creator.category.name}</span>}
                {creator.region && <span>{creator.region}</span>}
                {!creator.followers && !creator.category && !creator.region && <span className="muted">No additional fields returned</span>}
              </div>
              <Link className="btn btn-secondary" href={`/messages?creator=${encodeURIComponent(creator.messageCreatorId)}&username=${encodeURIComponent(creator.username || creator.name || "TikTok creator")}`}><MessageSquare size={16} />Message creator</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
