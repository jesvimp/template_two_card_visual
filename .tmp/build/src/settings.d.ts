import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
declare const Model: typeof formattingSettings.Model, SimpleCard: typeof formattingSettings.SimpleCard;
export declare class GeneralSettings extends SimpleCard {
    name: string;
    displayName: string;
    slices: formattingSettings.Slice[];
    get apiUrlSlice(): formattingSettings.TextInput | undefined;
}
export declare class VisualFormattingSettingsModel extends Model {
    general: GeneralSettings;
    cards: formattingSettings.Cards[];
}
export {};
