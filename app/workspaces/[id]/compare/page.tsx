import { CompareReviews } from "@/components/v2/CompareReviews";
export default async function ComparePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <CompareReviews workspaceId={id} />; }
