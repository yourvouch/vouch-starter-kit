"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { Workspace } from "@/lib/v2/storage";
import { AppHeader } from "./AppHeader";

export function WorkspaceShell({ workspace, active, children }: { workspace: Workspace; active: "latest" | "history" | "compare" | "actions" | "settings"; children: ReactNode }) {
  const base = `/workspaces/${workspace.id}`;
  const links = [[base, "Latest review", "latest"], [`${base}/history`, "Review history", "history"], [`${base}/compare`, "Compare", "compare"], [`${base}/actions`, "Actions", "actions"], [`${base}/settings`, "Workspace settings", "settings"]] as const;
  return <><AppHeader action={false} /><div className="workspace-head"><div><span className="workspace-mark">{workspace.name.slice(0, 1).toUpperCase()}</span><strong>{workspace.name}</strong><small>{workspace.packId} · Saved locally</small></div><nav aria-label="Workspace navigation">{links.map(([href, label, id]) => <Link className={active === id ? "active" : ""} href={href} key={id}>{label}</Link>)}</nav></div>{children}</>;
}
