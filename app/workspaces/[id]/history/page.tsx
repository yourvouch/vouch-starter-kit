import { ReviewHistory } from "@/components/v2/ReviewHistory";
export default async function HistoryPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <ReviewHistory workspaceId={id} />; }
