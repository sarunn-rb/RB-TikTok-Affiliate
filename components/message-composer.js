"use client";

import { useState } from "react";
import { CheckCircle2, LoaderCircle, MessageSquare, Send, UserRound } from "lucide-react";

export function MessageComposer({ connected, initialCreator = "", initialUsername = "" }) {
  const [creatorOpenId, setCreatorOpenId] = useState(initialCreator);
  const [username] = useState(initialUsername);
  const [conversationId, setConversationId] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState("");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function createConversation() {
    if (pending || !creatorOpenId.trim()) return;
    setPending("conversation"); setError(null); setResult(null);
    const response = await fetch("/api/conversations", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ creatorOpenId }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) setError({ message: data.error || "Conversation could not be created.", code: data.code, requestId: data.requestId });
    else { setConversationId(data.conversationId); setResult({ type: "conversation", text: data.isNew ? "Conversation created." : "Existing conversation retrieved.", requestId: data.requestId }); }
    setPending("");
  }

  async function sendMessage(event) {
    event.preventDefault();
    if (pending || !conversationId || !message.trim()) return;
    setPending("message"); setError(null); setResult(null);
    const response = await fetch("/api/messages/send", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ conversationId, message }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) setError({ message: data.error || "Message could not be sent.", code: data.code, requestId: data.requestId });
    else { setResult({ type: "message", text: "Affiliate message sent successfully.", requestId: data.requestId, messageId: data.messageId }); setMessage(""); }
    setPending("");
  }

  if (!connected) return <div className="panel panel-pad empty-state"><MessageSquare size={28} /><h2>Connect a shop to message creators</h2><p>Affiliate messaging requires an authorized seller session and the <code>seller.affiliate_messages.write</code> scope.</p></div>;

  return (
    <div className="message-layout">
      <div className="notice" role="note">TikTok Shop test accounts may return error <code>16030009</code> before a conversation ID is created. This is an expected sandbox restriction; an eligible seller account is required to complete message sending.</div>
      <section className="panel panel-pad stack">
        <div><h2 className="panel-title">1. Select creator</h2><p className="panel-copy">Choose one Creator Open ID. This POC does not support bulk recipients.</p></div>
        {username && <div className="selected-creator"><span className="creator-avatar"><UserRound size={19} /></span><div><strong>{username.startsWith("@") ? username : `@${username}`}</strong><span>Selected from Creator Marketplace</span></div></div>}
        <div className="field"><label htmlFor="creatorOpenId">Creator Open ID</label><input className="input" id="creatorOpenId" value={creatorOpenId} onChange={(event) => { setCreatorOpenId(event.target.value); setConversationId(""); }} maxLength={256} placeholder="Creator Open ID from search results" /></div>
        <button type="button" className="btn btn-secondary action-left" onClick={createConversation} disabled={Boolean(pending) || !creatorOpenId.trim()}>{pending === "conversation" ? <LoaderCircle className="spin" size={16} /> : <MessageSquare size={16} />}{pending === "conversation" ? "Creating…" : conversationId ? "Retrieve conversation again" : "Create or retrieve conversation"}</button>
      </section>
      <form className="panel panel-pad stack" onSubmit={sendMessage}>
        <div><h2 className="panel-title">2. Send affiliate message</h2><p className="panel-copy">If TikTok Shop returned a conversation ID, the message is sent only to the selected creator.</p></div>
        <div className="field"><label htmlFor="conversationId">conversation_id</label><input className="input mono" id="conversationId" value={conversationId} onChange={(event) => setConversationId(event.target.value)} maxLength={256} placeholder="Created in step 1" /></div>
        <div className="field"><label htmlFor="message">Message text</label><textarea className="textarea" id="message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={1000} placeholder="Write a concise collaboration message…" /><span className="help">{message.length}/1000 characters</span></div>
        <button className="btn btn-primary action-left" disabled={Boolean(pending) || !conversationId.trim() || !message.trim()}>{pending === "message" ? <LoaderCircle className="spin" size={16} /> : <Send size={16} />}{pending === "message" ? "Sending…" : "Send message"}</button>
      </form>
      {(error || result) && <div className={`notice ${error ? "notice-error" : "notice-success"}`} role={error ? "alert" : "status"}>{result && <CheckCircle2 size={18} />}{error ? <span>{error.message}{error.code && <> Error code: <code>{error.code}</code>.</>}{error.requestId && <> Request ID: <code>{error.requestId}</code>.</>}</span> : <span>{result.text}{result.messageId && <> Message ID: <code>{result.messageId}</code>.</>}{result.requestId && <> Request ID: <code>{result.requestId}</code>.</>}</span>}</div>}
    </div>
  );
}
