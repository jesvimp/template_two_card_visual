import powerbi from "powerbi-visuals-api";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import DataView = powerbi.DataView;
import PrimitiveValue = powerbi.PrimitiveValue;
import { valueFormatter } from "powerbi-visuals-utils-formattingutils";


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

const defaults: CardVisualSettings = {
  cardBackground: "#ffffff",
  padding: 12,
  cornerRadius: 8,
  shadow: true,
  field1: { color: "#111111", backgroundColor: "transparent", fontSize: 16 },
  field2: { color: "#444444", backgroundColor: "transparent", fontSize: 14 }
};

function getRoleIndex(columns: powerbi.DataViewMetadataColumn[], roleName: string): number | undefined {
  const i = columns.findIndex(c => c.roles && c.roles[roleName]);
  return i >= 0 ? i : undefined;
}

function toStr(v: powerbi.PrimitiveValue | undefined | null): string | undefined {
  return v == null ? undefined : String(v);
}

export function parseSettings(dataView?: DataView): CardVisualSettings {
  const objects = (dataView?.metadata?.objects ?? {}) as any;

  const getFill = (obj: string, prop: string, fallback: string) =>
    (objects?.[obj]?.[prop]?.solid?.color as string) || fallback;

  const getNum = (obj: string, prop: string, fallback: number) => {
    const v = objects?.[obj]?.[prop];
    return typeof v === "number" && Number.isFinite(v) ? v : fallback;
  };

  const getBool = (obj: string, prop: string, fallback: boolean) => {
    const v = objects?.[obj]?.[prop];
    return typeof v === "boolean" ? v : fallback;
  };

  return {
    cardBackground: getFill("card", "backgroundColor", defaults.cardBackground),
    padding:       getNum("card", "padding", defaults.padding),
    cornerRadius:  getNum("card", "cornerRadius", defaults.cornerRadius),
    shadow:        getBool("card", "shadow", defaults.shadow),

    field1: {
      color:           getFill("field1Style", "color", defaults.field1.color),
      backgroundColor: getFill("field1Style", "backgroundColor", defaults.field1.backgroundColor),
      fontSize:        getNum("field1Style", "fontSize", defaults.field1.fontSize)
    },
    field2: {
      color:           getFill("field2Style", "color", defaults.field2.color),
      backgroundColor: getFill("field2Style", "backgroundColor", defaults.field2.backgroundColor),
      fontSize:        getNum("field2Style", "fontSize", defaults.field2.fontSize)
    }
  };
}

export function transform(host: IVisualHost, dataView?: DataView): ViewModel {
  const settings = parseSettings(dataView);

  if (!dataView?.table?.rows?.length) {
    return { items: [], settings };
  }

  const table = dataView.table;
  const cols = table.columns;

  const idx = {
    field1: getRoleIndex(cols, "field1"),
    field2: getRoleIndex(cols, "field2")
  };

  const items: TwoFieldItem[] = table.rows.map((row, rIndex) => {
    const identity = host.createSelectionIdBuilder().withTable(table, rIndex).createSelectionId();

    return {
      field1: idx.field1 !== undefined ? toStr(row[idx.field1]) : undefined,
      field2: idx.field2 !== undefined ? toStr(row[idx.field2]) : undefined,
      identity
    };
  });

  return { items, settings };
}