import { Suspense } from "react";
import { ReviewFlow } from "@/components/v2/ReviewFlow";
export default function ReviewPage() { return <Suspense fallback={<p>Preparing your review…</p>}><ReviewFlow /></Suspense>; }
