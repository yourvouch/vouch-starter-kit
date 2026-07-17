"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PackId } from "@/lib/v2/domain";
import { measureAction } from "@/lib/v2/actions";
import { parseBusinessFile } from "@/lib/v2/import";
import { mappingReadiness, suggestMappings } from "@/lib/v2/mapping";
import { verticalPacks } from "@/lib/v2/packs";
import { buildReviewSnapshot } from "@/lib/v2/reviews";
import { createWorkspace, get, listActions, listReviews, put, saveReviewSnapshot, updateWorkspace, type Workspace } from "@/lib/v2/storage";
import { AppHeader } from "./AppHeader";

const stepNames = ["Choose business type", "Select data", "Confirm mapping", "Stages & identity", "Review readiness", "Save review"];

export function ReviewFlow() {
  const router = useRouter(); const params = useSearchParams(); const existingWorkspaceId = params.get("workspace");
  const samplePack = (params.get("sample") as PackId | null) ?? "interiors";
  const [step, setStep] = useState(params.has("sample") ? 2 : 1);
  const [packId, setPackId] = useState<PackId>(params.has("sample") ? samplePack : "general");
  const [workspace, setWorkspace] = useState<Workspace>(); const [workspaceName, setWorkspaceName] = useState("");
  const [rows, setRows] = useState<Record<string, string>[]>(params.has("sample") ? verticalPacks[samplePack].samples.current : []);
  const [fileName, setFileName] = useState(params.has("sample") ? `${verticalPacks[samplePack].name} sample` : "");
  const [error, setError] = useState(""); const [saving, setSaving] = useState(false); const [reviewDate, setReviewDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => { if (!existingWorkspaceId) return; void get<Workspace>("workspaces", existingWorkspaceId).then((saved) => { if (!saved) { setError("The selected workspace no longer exists."); return; } setWorkspace(saved); setWorkspaceName(saved.name); setPackId(saved.packId); setStep(2); }); }, [existingWorkspaceId]);

  const pack = verticalPacks[packId]; const headers = Object.keys(rows[0] ?? {}); const mappings = suggestMappings(headers, rows, pack); const readiness = mappingReadiness(mappings);
  async function onFile(file?: File) { if (!file) return; setError(""); try { const parsed = await parseBusinessFile(file); setRows(parsed.rows); setFileName(parsed.name); setStep(3); } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not read this file."); } }
  async function saveReview() {
    setSaving(true); setError("");
    try {
      const selectedWorkspace = workspace ?? await createWorkspace({ name: workspaceName || `${pack.name} workspace`, packId, mapping: Object.fromEntries(mappings.filter((item) => item.column).map((item) => [item.field, item.column!])) });
      if (workspace) await updateWorkspace({ ...workspace, mapping: Object.fromEntries(mappings.filter((item) => item.column).map((item) => [item.field, item.column!])) });
      const previousReviews = await listReviews(selectedWorkspace.id);
      const snapshot = buildReviewSnapshot({ workspaceId: selectedWorkspace.id, packId, reviewDate, readiness, rows, mappings });
      await saveReviewSnapshot(snapshot);
      const actions = await listActions(selectedWorkspace.id);
      for (const action of actions.filter((item) => item.opportunityIds.length && item.reviewId !== snapshot.id)) {
        const origin = previousReviews.find((item) => item.id === action.reviewId);
        if (origin && (origin.reviewDate < snapshot.reviewDate || origin.reviewDate === snapshot.reviewDate && origin.createdAt < snapshot.createdAt)) await put("actions", measureAction(action, origin, snapshot, pack));
      }
      router.push(`/workspaces/${selectedWorkspace.id}`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "The review could not be saved."); setSaving(false); }
  }

  return <><AppHeader action={false} /><main className="review-shell"><aside className="stepper" aria-label="Review progress"><p>{workspace ? workspace.name : "Founder review"}</p><ol>{stepNames.map((name, index) => <li key={name} className={step === index + 1 ? "active" : step > index + 1 ? "done" : ""}><span>{index + 1}</span>{name}</li>)}</ol><div className="local-note"><strong>Processed locally</strong><span>Uploaded files are never stored.</span></div></aside><section className="review-stage"><div className="review-title"><span>Step {step} of 6</span><h1>{stepNames[step - 1]}</h1></div>{step === 1 ? <div className="pack-grid">{Object.values(verticalPacks).map((item) => <button key={item.id} className={packId === item.id ? "pack selected" : "pack"} onClick={() => setPackId(item.id)}><strong>{item.name}</strong><span>{item.description}</span><small>{item.fields.length} fields · {item.rules.length} rules</small></button>)}<button className="button button-primary next" onClick={() => setStep(2)}>Continue with {pack.name}</button></div> : null}{step === 2 ? <div className="upload-panel"><label className="drop"><input type="file" accept=".csv,.xlsx" onChange={(event) => onFile(event.target.files?.[0])} /><strong>Choose a CSV or Excel workbook</strong><span>Parsed locally · up to 50,000 retained rows · file binary is discarded</span></label><div className="or"><span>or</span></div><button className="sample-button" onClick={() => { const sample = workspace && (awaitableDate(reviewDate) % 2 === 0) ? pack.samples.previous : pack.samples.current; setRows(sample); setFileName(`${pack.name} sample`); setStep(3); }}><strong>Use the {pack.name} sample</strong><span>Use a realistic dated review with intentional data gaps.</span></button>{error ? <p className="error" role="alert">{error}</p> : null}</div> : null}{step === 3 ? <div><div className="file-summary"><div><span>Source</span><strong>{fileName}</strong></div><div><span>Rows retained</span><strong>{rows.length.toLocaleString("en-IN")}</strong></div><div><span>Columns</span><strong>{headers.length}</strong></div></div><div className="mapping-list">{(["required", "recommended", "optional"] as const).map((importance) => <section key={importance}><h2>{importance}</h2>{mappings.filter((item) => item.importance === importance).map((item) => <div className="mapping-row" key={item.field}><div><strong>{pack.fields.find((field) => field.key === item.field)?.label}</strong><span>{item.explanation}</span></div><div><span>{item.column ?? "Not mapped"}</span><small>{Math.round(item.confidence * 100)}% confidence</small></div><div className="samples">{item.samples.join(" · ") || "No sample values"}</div></div>)}</section>)}</div><button className="button button-primary next" onClick={() => setStep(4)}>Confirm mapping</button></div> : null}{step === 4 ? <div className="confirmation"><section><h2>Confirm stage semantics</h2><ol className="stage-list">{pack.stages.map((stage) => <li key={stage.name}><span>{stage.order + 1}</span><strong>{stage.name}</strong><em>{stage.lifecycle}</em></li>)}</ol></section><section><h2>Opportunity identity</h2>{["Explicit ID — High confidence", "Email plus name/company — Medium", "Phone plus name/company — Medium", "Fingerprint — Low"].map((item, index) => <div className="identity-row" key={item}><span>{index + 1}</span>{item}</div>)}<label className="date-field">Review date<input type="date" value={reviewDate} onChange={(event) => setReviewDate(event.target.value)} /></label></section><button className="button button-primary next" onClick={() => setStep(5)}>Confirm stages and identity</button></div> : null}{step === 5 ? <div className="readiness"><div className={`readiness-state ${readiness}`}><span>{readiness === "full" ? "Ready" : "Review needed"}</span><h2>{readiness === "full" ? "Full review readiness" : readiness === "reduced" ? "Reduced review readiness" : "Missing essential information"}</h2><p>Historical scoring will be stored exactly as generated and will never be silently rescored.</p></div>{workspace ? <p>This review will be added to <strong>{workspace.name}</strong>.</p> : <label className="date-field">Workspace name<input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} placeholder="e.g. Northstar Studio" /></label>}<ul>{[`${mappings.filter((item) => item.column).length} fields mapped`, `${rows.length} rows ready`, `Review date: ${reviewDate}`].map((item) => <li key={item}>✓ {item}</li>)}</ul><button className="button button-primary next" disabled={readiness === "missing-essential" || saving || (!workspace && !workspaceName.trim())} onClick={saveReview}>{saving ? "Saving locally…" : workspace ? "Save later review" : "Create workspace and save review"}</button>{error ? <p className="error" role="alert">{error}</p> : null}</div> : null}</section></main></>;
}

const awaitableDate = (value: string) => Number(value.replaceAll("-", ""));
