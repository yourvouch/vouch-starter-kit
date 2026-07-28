import { notFound } from "next/navigation";
import { ExampleWorkspace } from "@/components/v2/ExampleWorkspace";
import { EXAMPLE_SLUGS, packIdForExampleSlug } from "@/lib/v2/examples";

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(EXAMPLE_SLUGS).map((pack) => ({ pack }));
}

export default async function ExamplePage({ params }: { params: Promise<{ pack: string }> }) {
  const { pack } = await params;
  const packId = packIdForExampleSlug(pack);
  if (!packId) notFound();
  return <ExampleWorkspace packId={packId} />;
}
