"use client";

import { useState } from "react";
import { Link2, LoaderCircle, RefreshCw, Unplug } from "lucide-react";
import { useRouter } from "next/navigation";

export function ConnectButton({ reconnect = false }) {
  return (
    <a className={reconnect ? "btn btn-secondary" : "btn btn-primary"} href="/api/tiktok/authorize">
      {reconnect ? <RefreshCw size={16} /> : <Link2 size={16} />}
      {reconnect ? "Reconnect" : "Connect TikTok Shop"}
    </a>
  );
}

export function DisconnectButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function disconnect() {
    if (pending || !window.confirm("Disconnect this TikTok Shop from the reviewer session?")) return;
    setPending(true);
    const response = await fetch("/api/tiktok/disconnect", { method: "POST" });
    if (response.ok) {
      router.refresh();
      return;
    }
    setPending(false);
  }

  return (
    <button className="btn btn-danger" onClick={disconnect} disabled={pending}>
      {pending ? <LoaderCircle className="spin" size={16} /> : <Unplug size={16} />}
      {pending ? "Disconnecting…" : "Disconnect"}
    </button>
  );
}

export function ShopSelector({ shops }) {
  const router = useRouter();
  const [pending, setPending] = useState(null);

  async function selectShop(index) {
    if (pending !== null) return;
    setPending(index);
    const response = await fetch("/api/tiktok/select-shop", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ index }),
    });
    if (response.ok) router.refresh();
    setPending(null);
  }

  if (!Array.isArray(shops) || shops.length < 2) return null;
  return (
    <div className="shop-selector">
      <h3>Authorized shops</h3>
      <p>Select which shop and shop cipher to use for product, order, Creator Marketplace, and Affiliate Seller API calls.</p>
      <div className="shop-options">
        {shops.map((shop) => (
          <button key={`${shop.id || shop.name}-${shop.index}`} className={`shop-option ${shop.selected ? "shop-option-active" : ""}`} onClick={() => selectShop(shop.index)} disabled={pending !== null || shop.selected}>
            <span><strong>{shop.name}</strong><small>{[shop.region, shop.sellerType].filter(Boolean).join(" · ") || "Market details not returned"}</small></span>
            <span className={`status ${shop.selected ? "status-success" : "status-neutral"}`}>{shop.selected ? "Selected" : pending === shop.index ? "Selecting…" : "Use shop"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
