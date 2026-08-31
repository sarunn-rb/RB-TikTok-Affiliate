"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BadgeCheck, CircleAlert, Database, LoaderCircle, PackageSearch, ReceiptText, RefreshCw,
} from "lucide-react";

function formatDate(value) {
  if (!value) return "Not returned";
  const date = typeof value === "number" ? new Date(value * 1000) : new Date(value);
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

function ScopeStatus({ label, granted }) {
  return <span className={`status ${granted ? "status-success" : "status-warning"}`}>{label}: {granted ? "Granted" : "Reconnect required"}</span>;
}

function SourceDetails({ result }) {
  return (
    <dl className="sync-source">
      <div><dt>Source endpoint</dt><dd><code>{result.source.endpoint}</code></dd></div>
      <div><dt>TikTok request ID</dt><dd><code>{result.source.requestId || "Not returned"}</code></dd></div>
    </dl>
  );
}

function ProductRecord({ product }) {
  const expectedFormat = product.id.startsWith("17");
  return (
    <li className="sync-record">
      <div className="sync-record-heading"><div><span className="sync-record-label">Product ID</span><code className="sync-record-id">{product.id}</code></div><span className={`sync-format ${expectedFormat ? "sync-format-valid" : ""}`}>{expectedFormat ? "Starts with 17" : "Exact TikTok ID"}</span></div>
      <strong>{product.title || "Title not returned"}</strong>
      <div className="sync-record-meta"><span>Status: {product.status || "Not returned"}</span><span>Created: {formatDate(product.createTime)}</span><span>Updated: {formatDate(product.updateTime)}</span></div>
    </li>
  );
}

function OrderRecord({ order }) {
  const expectedFormat = /^(57|58)/.test(order.id);
  return (
    <li className="sync-record">
      <div className="sync-record-heading"><div><span className="sync-record-label">Order ID</span><code className="sync-record-id">{order.id}</code></div><span className={`sync-format ${expectedFormat ? "sync-format-valid" : ""}`}>{expectedFormat ? "Starts with 57/58" : "Exact TikTok ID"}</span></div>
      <div className="sync-record-meta"><span>Status: {order.status || "Not returned"}</span>{order.isSampleOrder !== null && <span>{order.isSampleOrder ? "Sample order" : "Standard order"}</span>}<span>Created: {formatDate(order.createTime)}</span><span>Updated: {formatDate(order.updateTime)}</span></div>
    </li>
  );
}

function DatasetPanel({ title, icon: Icon, result, kind }) {
  const records = result.items || [];
  return (
    <section className="panel sync-dataset">
      <div className="sync-dataset-heading"><div><Icon size={21} /><div><h2 className="panel-title">{title}</h2><p className="panel-copy">{result.total === null ? "Total not returned" : `${result.total} record${result.total === 1 ? "" : "s"} returned by TikTok Shop`}</p></div></div></div>
      <SourceDetails result={result} />
      {result.error && <div className="notice notice-error" role="alert"><CircleAlert size={17} /><span>{result.error.message}{result.error.code ? ` (code ${result.error.code})` : ""}</span></div>}
      {!result.error && records.length === 0 && <div className="sync-empty"><Database size={24} /><strong>No {kind} records returned</strong><p>This authorized shop returned an empty list. The application does not create placeholder records.</p></div>}
      {records.length > 0 && <ul className="sync-record-list">{records.map((record) => kind === "product" ? <ProductRecord key={record.id} product={record} /> : <OrderRecord key={record.id} order={record} />)}</ul>}
    </section>
  );
}

export function TikTokDataSync({ connected, productScope, orderScope }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function synchronize() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/data-sync", { method: "POST" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "TikTok Shop data synchronization failed.");
      setResult(data);
    } catch (syncError) {
      setResult(null);
      setError(syncError.message || "TikTok Shop data synchronization failed.");
    } finally {
      setPending(false);
    }
  }

  if (!connected) {
    return <div className="panel panel-pad empty-state"><Database size={28} /><h2>Connect a shop to synchronize data</h2><p>Product and order requests require a seller access token and the selected shop cipher.</p><Link className="btn btn-primary" href="/shop">Open Shop Connection</Link></div>;
  }

  return (
    <div className="stack">
      <section className="panel panel-pad sync-toolbar">
        <div><h2 className="panel-title">Read live seller-authorized records</h2><p className="panel-copy">This on-demand check displays exact IDs returned by TikTok Shop. It does not modify shop data, retain records, or create sample IDs.</p><div className="sync-scopes"><ScopeStatus label="Product Basic" granted={productScope} /><ScopeStatus label="Order Information" granted={orderScope} /></div></div>
        <button className="btn btn-primary" type="button" onClick={synchronize} disabled={pending}>{pending ? <LoaderCircle className="spin" size={17} /> : result ? <RefreshCw size={17} /> : <Database size={17} />}{pending ? "Synchronizing…" : result ? "Sync again" : "Sync TikTok Shop data"}</button>
      </section>
      {(!productScope || !orderScope) && <div className="notice" role="status"><CircleAlert size={17} /><span>Reconnect the shop after Product Basic and Order Information are approved so the new access token includes both scopes.</span></div>}
      {error && <div className="notice notice-error" role="alert"><CircleAlert size={17} /><span>{error}</span></div>}
      {result && (
        <>
          <section className="panel panel-pad creator-source" aria-label="TikTok Shop synchronization source">
            <div className="creator-source-heading"><BadgeCheck size={21} /><div><h2 className="panel-title">TikTok Shop data verified</h2><p className="panel-copy">These product and order records were returned by live, seller-authorized Open API requests.</p></div></div>
            <dl className="creator-source-grid"><div><dt>Authorized Shop ID</dt><dd><code>{result.shopId || "Not returned"}</code></dd></div><div><dt>Synchronized</dt><dd>{formatDate(result.synchronizedAt)}</dd></div></dl>
          </section>
          <div className="sync-grid"><DatasetPanel title="Products" icon={PackageSearch} result={result.products} kind="product" /><DatasetPanel title="Orders" icon={ReceiptText} result={result.orders} kind="order" /></div>
        </>
      )}
    </div>
  );
}
