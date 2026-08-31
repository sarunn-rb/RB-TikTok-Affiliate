"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpenCheck, Database, Home, Menu, MessageSquare, Settings, Store, Users, X,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { LogoutButton } from "@/components/logout-button";

const navigation = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/shop", label: "Shop Connection", icon: Store },
  { href: "/data-sync", label: "Data Sync", icon: Database },
  { href: "/creators", label: "Creators", icon: Users },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLink({ item, onClick }) {
  const pathname = usePathname();
  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
  const Icon = item.icon;
  return (
    <Link className={`nav-link ${active ? "nav-link-active" : ""}`} href={item.href} onClick={onClick}>
      <Icon size={20} strokeWidth={1.8} />
      <span>{item.label}</span>
    </Link>
  );
}

export function AppShell({ username, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-layout">
      <header className="mobile-header">
        <Brand />
        <button className="icon-button" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
      </header>
      {open && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <Brand />
          <button className="icon-button sidebar-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={20} /></button>
        </div>
        <nav className="sidebar-nav" aria-label="Primary navigation">
          {navigation.map((item) => <NavLink key={item.href} item={item} onClick={() => setOpen(false)} />)}
        </nav>
        <div className="sidebar-footer">
          <div className="mobile-account">
            <span><span className="avatar-dot">R</span>{username}</span>
            <LogoutButton compact />
          </div>
          <NavLink item={{ href: "/review", label: "App Review Guide", icon: BookOpenCheck }} onClick={() => setOpen(false)} />
        </div>
      </aside>
      <div className="app-main">
        <div className="desktop-bar">
          <div className="reviewer-identity"><span className="avatar-dot">R</span><span>{username}</span></div>
          <LogoutButton />
        </div>
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
