import { WorkspaceHome } from "@/components/v2/WorkspaceHome";
export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <WorkspaceHome workspaceId={id} />; }
