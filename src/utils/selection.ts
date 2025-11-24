import powerbi from "powerbi-visuals-api";
import ISelectionId = powerbi.extensibility.ISelectionId;

/**
* Converts a selection id into a stable string for equality checks.
* Works across API versions (falls back if some methods are missing).
*/
export function selectionIdToString(id: ISelectionId): string {
  const anyId = id as any;
  try {
    if (typeof anyId.getSelectorsByColumn === "function") {
      const byCol = anyId.getSelectorsByColumn();
      if (byCol) return JSON.stringify(byCol);
    }
    if (typeof anyId.getSelector === "function") {
      const sel = anyId.getSelector();
      if (sel) return JSON.stringify(sel);
    }
    if (typeof anyId.getKey === "function") {
      return anyId.getKey();
    }
  } catch {}
  return String(id);
}

export function selectionIdArrayToSet(ids: ISelectionId[]): Set<string> {
  return new Set(ids.map(selectionIdToString));
}
 