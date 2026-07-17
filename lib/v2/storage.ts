import type { VouchAction } from "./actions";
import type { PackId, ReviewSnapshot } from "./domain";

export const SCHEMA_VERSION = 2;
export const DB_NAME = "vouch-starter-kit";
export const STORE_NAMES = ["workspaces", "reviews", "actions"] as const;
export type StoreName = (typeof STORE_NAMES)[number];

export interface Workspace {
  id: string;
  name: string;
  packId: PackId;
  createdAt: string;
  updatedAt: string;
  mapping: Record<string, string>;
  preferences: Record<string, string | boolean>;
}

export interface Backup {
  schemaVersion: number;
  exportedAt: string;
  workspaces: Workspace[];
  reviews: ReviewSnapshot[];
  actions: VouchAction[];
}

export interface ImportPreview {
  valid: boolean;
  errors: string[];
  counts: { workspaces: number; reviews: number; actions: number };
  conflicts: { store: StoreName; id: string; label: string }[];
}

const clone = <T>(value: T): T => structuredClone(value);
const transactionDone = (tx: IDBTransaction) => new Promise<void>((resolve, reject) => {
  tx.oncomplete = () => resolve();
  tx.onerror = () => reject(tx.error);
  tx.onabort = () => reject(tx.error ?? new Error("IndexedDB transaction was aborted."));
});
const resultOf = <T>(request: IDBRequest<T>) => new Promise<T>((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

export function applySchemaMigration(db: IDBDatabase, tx: IDBTransaction, oldVersion: number) {
  for (const name of STORE_NAMES) {
    const store = db.objectStoreNames.contains(name)
      ? tx.objectStore(name)
      : db.createObjectStore(name, { keyPath: "id" });
    if (name !== "workspaces" && !store.indexNames.contains("workspaceId")) {
      store.createIndex("workspaceId", "workspaceId", { unique: false });
    }
  }
  if (oldVersion < 2) {
    const workspaces = tx.objectStore("workspaces");
    workspaces.openCursor().onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
      if (!cursor) return;
      cursor.update({ mapping: {}, preferences: {}, ...cursor.value });
      cursor.continue();
    };
  }
}

export const openVouchDb = () => new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, SCHEMA_VERSION);
  request.onupgradeneeded = (event) => applySchemaMigration(request.result, request.transaction!, event.oldVersion);
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

export async function put<T extends { id: string }>(storeName: StoreName, value: T) {
  const db = await openVouchDb();
  const tx = db.transaction(storeName, "readwrite");
  tx.objectStore(storeName).put(clone(value));
  await transactionDone(tx);
  db.close();
}

export async function get<T>(storeName: StoreName, id: string) {
  const db = await openVouchDb();
  const value = await resultOf(db.transaction(storeName).objectStore(storeName).get(id)) as T | undefined;
  db.close();
  return value ? clone(value) : undefined;
}

export async function all<T>(storeName: StoreName) {
  const db = await openVouchDb();
  const values = await resultOf(db.transaction(storeName).objectStore(storeName).getAll()) as T[];
  db.close();
  return clone(values);
}

export async function remove(storeName: StoreName, id: string) {
  const db = await openVouchDb();
  const tx = db.transaction(storeName, "readwrite");
  tx.objectStore(storeName).delete(id);
  await transactionDone(tx);
  db.close();
}

export async function byWorkspace<T extends { workspaceId: string }>(storeName: "reviews" | "actions", workspaceId: string) {
  const db = await openVouchDb();
  const store = db.transaction(storeName).objectStore(storeName);
  const values = await resultOf(store.index("workspaceId").getAll(workspaceId)) as T[];
  db.close();
  return clone(values);
}

export async function createWorkspace(input: { name: string; packId: PackId; mapping?: Record<string, string>; preferences?: Record<string, string | boolean> }) {
  const now = new Date().toISOString();
  const workspace: Workspace = { id: crypto.randomUUID(), name: input.name.trim() || "Untitled workspace", packId: input.packId, createdAt: now, updatedAt: now, mapping: input.mapping ?? {}, preferences: input.preferences ?? {} };
  await put("workspaces", workspace);
  return workspace;
}

export async function updateWorkspace(workspace: Workspace) {
  const updated = { ...workspace, updatedAt: new Date().toISOString() };
  await put("workspaces", updated);
  return updated;
}

export async function saveReviewSnapshot(snapshot: ReviewSnapshot) {
  if (await get<ReviewSnapshot>("reviews", snapshot.id)) throw new Error("Review snapshots are immutable and cannot be overwritten.");
  await put("reviews", snapshot);
  const workspace = await get<Workspace>("workspaces", snapshot.workspaceId);
  if (workspace) await updateWorkspace(workspace);
  return clone(snapshot);
}

export async function listWorkspaces() {
  return (await all<Workspace>("workspaces")).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function listReviews(workspaceId: string) {
  return (await byWorkspace<ReviewSnapshot>("reviews", workspaceId)).sort((a, b) => b.reviewDate.localeCompare(a.reviewDate) || b.createdAt.localeCompare(a.createdAt));
}

export async function listActions(workspaceId?: string) {
  const values = workspaceId ? await byWorkspace<VouchAction>("actions", workspaceId) : await all<VouchAction>("actions");
  return values.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function deleteWorkspace(id: string) {
  const db = await openVouchDb();
  const tx = db.transaction(STORE_NAMES, "readwrite");
  tx.objectStore("workspaces").delete(id);
  for (const storeName of ["reviews", "actions"] as const) {
    const index = tx.objectStore(storeName).index("workspaceId");
    index.openKeyCursor(IDBKeyRange.only(id)).onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursor | null>).result;
      if (!cursor) return;
      tx.objectStore(storeName).delete(cursor.primaryKey);
      cursor.continue();
    };
  }
  await transactionDone(tx);
  db.close();
}

export async function clearAll() {
  const db = await openVouchDb();
  const tx = db.transaction(STORE_NAMES, "readwrite");
  for (const store of STORE_NAMES) tx.objectStore(store).clear();
  await transactionDone(tx);
  db.close();
}

export async function exportBackup(): Promise<Backup> {
  const [workspaces, reviews, actions] = await Promise.all([all<Workspace>("workspaces"), all<ReviewSnapshot>("reviews"), all<VouchAction>("actions")]);
  return { schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), workspaces, reviews, actions };
}

export function validateBackup(input: unknown): Backup {
  if (!input || typeof input !== "object") throw new Error("Backup must be a JSON object.");
  const backup = input as Partial<Backup>;
  if (typeof backup.schemaVersion !== "number") throw new Error("Backup schema version is missing.");
  if (backup.schemaVersion > SCHEMA_VERSION) throw new Error("This backup was created by a newer Vouch schema and cannot be imported safely.");
  if (![backup.workspaces, backup.reviews, backup.actions].every(Array.isArray)) throw new Error("Backup is missing workspaces, reviews, or actions.");
  return clone(backup as Backup);
}

export async function previewImport(input: unknown): Promise<ImportPreview> {
  try {
    const backup = validateBackup(input);
    const current = await Promise.all([all<Workspace>("workspaces"), all<ReviewSnapshot>("reviews"), all<VouchAction>("actions")]);
    const existing = current.map((items) => new Set(items.map((item) => item.id)));
    const groups = [backup.workspaces, backup.reviews, backup.actions] as const;
    const names: StoreName[] = ["workspaces", "reviews", "actions"];
    const conflicts = groups.flatMap((items, index) => items.filter((item) => existing[index].has(item.id)).map((item) => ({ store: names[index], id: item.id, label: "name" in item ? String(item.name) : "title" in item ? String(item.title) : item.reviewDate })));
    return { valid: true, errors: [], counts: { workspaces: backup.workspaces.length, reviews: backup.reviews.length, actions: backup.actions.length }, conflicts };
  } catch (error) {
    return { valid: false, errors: [error instanceof Error ? error.message : "Invalid backup."], counts: { workspaces: 0, reviews: 0, actions: 0 }, conflicts: [] };
  }
}

export async function importBackup(input: unknown, mode: "merge" | "replace") {
  const backup = validateBackup(input);
  if (mode === "replace") await clearAll();
  const db = await openVouchDb();
  const tx = db.transaction(STORE_NAMES, "readwrite");
  for (const item of backup.workspaces) tx.objectStore("workspaces").put({ ...clone(item), mapping: item.mapping ?? {}, preferences: item.preferences ?? {} });
  for (const item of backup.reviews) tx.objectStore("reviews").put(clone(item));
  for (const item of backup.actions) tx.objectStore("actions").put(clone(item));
  await transactionDone(tx);
  db.close();
}
