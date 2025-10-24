// src/settings.ts
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

const { Model, SimpleCard, TextInput } = formattingSettings;

export class GeneralSettings extends SimpleCard {
  name: string = "general";
  displayName: string = "General";

  slices: formattingSettings.Slice[] = [
    new TextInput({
      name: "apiUrl",
      displayName: "API URL",
      value: "", // keep empty to satisfy lint
      placeholder: "https://host:port/path"
    })
  ];

  get apiUrlSlice(): formattingSettings.TextInput | undefined {
    return this.slices.find(s => (s as any).name === "apiUrl") as formattingSettings.TextInput | undefined;
  }
}

export class VisualFormattingSettingsModel extends Model {
  general = new GeneralSettings();
  cards: formattingSettings.Cards[] = [this.general];
}