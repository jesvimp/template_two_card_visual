import powerbi from "powerbi-visuals-api";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import DataView = powerbi.DataView;
/**
 * What this file does
 * - Defines small TypeScript interfaces for our visual's data and settings.
 * - Reads the user's Format pane settings from dataView.metadata.objects.
 * - Converts the Power BI table data into a clean array of rows for React.
 * - Creates selection IDs for each row so clicking a card can select data.
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
/**
 * parseSettings
 * Reads the settings the user can change in the Format pane and merges them with defaults.
 * All settings are defined in capabilities.json → "objects".
 */
export declare function parseSettings(dataView?: DataView): CardVisualSettings;
/**
 * transform
 * - Reads data from the Power BI DataView (we expect table mapping).
 * - Locates which columns were put into "field1" and "field2" roles.
 * - Builds an array of items (one per row), including a selection identity.
 * - Returns the items plus the merged settings.
 */
export declare function transform(host: IVisualHost, dataView?: DataView): ViewModel;
