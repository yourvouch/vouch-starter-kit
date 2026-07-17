import { ActionCentre } from "@/components/v2/ActionCentre";
export default async function WorkspaceActionsPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <ActionCentre workspaceId={id} />; }
