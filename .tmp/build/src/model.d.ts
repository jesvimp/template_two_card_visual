import powerbi from "powerbi-visuals-api";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import DataView = powerbi.DataView;
/**
 * model.ts
 * Purpose:
 * - Transform the Power BI DataView into a simple array of rows with two fields.
 * - Read and merge visual settings from the Format pane (metadata.objects).
 * - Keep default settings so the visual looks OK even without user edits.
 */
export interface FieldStyle {
    color: string;
    backgroundColor: string;
    fontSize: number;
}
export interface CardVisualSettings {
    cardBackground: string;
    padding: number;
    cornerRadius: number;
    shadow: boolean;
    field1: FieldStyle;
    field2: FieldStyle;
}
export interface TwoFieldItem {
    field1?: string;
    field2?: string;
    identity?: powerbi.extensibility.ISelectionId;
}
export interface ViewModel {
    items: TwoFieldItem[];
    settings: CardVisualSettings;
}
export declare function parseSettings(dataView?: DataView): CardVisualSettings;
export declare function transform(host: IVisualHost, dataView?: DataView): ViewModel;
