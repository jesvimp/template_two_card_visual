import powerbi from "powerbi-visuals-api";
import ISelectionId = powerbi.extensibility.ISelectionId;
/**
* Converts a selection id into a stable string for equality checks.
* Works across API versions (falls back if some methods are missing).
*/
export declare function selectionIdToString(id: ISelectionId): string;
export declare function selectionIdArrayToSet(ids: ISelectionId[]): Set<string>;
