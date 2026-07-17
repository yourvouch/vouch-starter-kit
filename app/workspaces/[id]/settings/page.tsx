import { WorkspaceSettings } from "@/components/v2/WorkspaceSettings";
export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <WorkspaceSettings workspaceId={id} />; }
