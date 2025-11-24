import powerbi from "powerbi-visuals-api";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import DataView = powerbi.DataView;
// PrimitiveValue is the runtime type for values coming from Power BI (string, number, boolean, Date, etc.)
import PrimitiveValue = powerbi.PrimitiveValue;

/**
 * What this file does
 * - Defines small TypeScript interfaces for our visual's data and settings.
 * - Reads the user's Format pane settings from dataView.metadata.objects.
 * - Converts the Power BI table data into a clean array of rows for React.
 * - Creates selection IDs for each row so clicking a card can select data.
 */

/* ---------- Types used by the React UI ---------- */

// Controls how one text field should look.
export interface FieldStyle {
  color: string;            // text color, e.g. "#111111"
  backgroundColor: string;  // background behind the text, e.g. "transparent" or "#FFEECC"
  fontSize: number;         // font size in pixels
}

// All visual-level settings that affect the card + both fields.
export interface CardVisualSettings {
  cardBackground: string;   // card background color
  padding: number;          // inner spacing in px
  cornerRadius: number;     // rounded corners in px
  shadow: boolean;          // show a subtle shadow or not
  field1: FieldStyle;       // style for field 1
  field2: FieldStyle;       // style for field 2
}

// One row (one card) produced from the DataView.
export interface TwoFieldItem {
  field1?: string;  // text for field 1 (may be undefined if not provided)
  field2?: string;  // text for field 2 (may be undefined if not provided)
  identity?: powerbi.extensibility.ISelectionId; // used for selection in the report
}

// The full model passed to React: all rows + the merged settings.
export interface ViewModel {
  items: TwoFieldItem[];
  settings: CardVisualSettings;
}

/* ---------- Default settings (used when user hasn't changed the Format pane) ---------- */

const defaults: CardVisualSettings = {
  // 8-digit hex includes alpha channel (last two digits = FF = fully opaque)
  cardBackground: "#ffffffff",
  padding: 12,
  cornerRadius: 8,
  shadow: true,
  field1: { color: "#111111", backgroundColor: "transparent", fontSize: 16 },
  field2: { color: "#444444", backgroundColor: "transparent", fontSize: 14 }
};

/* ---------- Small helpers ---------- */

/**
 * Finds the column index for a given role name (as defined in capabilities.json).
 * Returns undefined if the role isn't present.
 */
function getRoleIndex(columns: powerbi.DataViewMetadataColumn[], roleName: string): number | undefined {
  const i = columns.findIndex(c => c.roles && c.roles[roleName]);
  return i >= 0 ? i : undefined;
}

/**
 * Safely converts a PrimitiveValue to a string (or undefined if null/undefined).
 * Power BI cells can be numbers, strings, booleans, dates, or null.
 */
function toStr(v: PrimitiveValue | undefined | null): string | undefined {
  return v == null ? undefined : String(v);
}

/* ---------- Read settings from the Format pane ---------- */

/**
 * parseSettings
 * Reads the settings the user can change in the Format pane and merges them with defaults.
 * All settings are defined in capabilities.json → "objects".
 */
export function parseSettings(dataView?: DataView): CardVisualSettings {
  // metadata.objects holds all the Format pane values for the visual.
  // Use optional chaining + default empty object to avoid crashes when not set.
  const objects = (dataView?.metadata?.objects ?? {}) as any;

  // Helper: read a color from a "fill" property. If not set, use fallback.
  // Format pane colors are stored as { solid: { color: "#RRGGBB" } }
  const getFill = (obj: string, prop: string, fallback: string) =>
    (objects?.[obj]?.[prop]?.solid?.color as string) || fallback;

  // Helper: read a number with a fallback.
  const getNum = (obj: string, prop: string, fallback: number) => {
    const v = objects?.[obj]?.[prop];
    return typeof v === "number" && Number.isFinite(v) ? v : fallback;
  };

  // Helper: read a boolean with a fallback.
  const getBool = (obj: string, prop: string, fallback: boolean) => {
    const v = objects?.[obj]?.[prop];
    return typeof v === "boolean" ? v : fallback;
  };

  // Build the final settings object, pulling values from:
  // - "card" object (card-level properties)
  // - "field1Style" and "field2Style" objects (per-field styles)
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

/* ---------- Turn the DataView into the ViewModel used by React ---------- */

/**
 * transform
 * - Reads data from the Power BI DataView (we expect table mapping).
 * - Locates which columns were put into "field1" and "field2" roles.
 * - Builds an array of items (one per row), including a selection identity.
 * - Returns the items plus the merged settings.
 */
export function transform(host: IVisualHost, dataView?: DataView): ViewModel {
  // Always read the latest settings so UI reflects Format pane changes instantly.
  const settings = parseSettings(dataView);

  // If there are no rows yet (e.g., no fields assigned), return empty items.
  if (!dataView?.table?.rows?.length) {
    return { items: [], settings };
  }

  const table = dataView.table;
  const cols = table.columns;

  // Find the indices of the columns the author placed into each role.
  const idx = {
    field1: getRoleIndex(cols, "field1"),
    field2: getRoleIndex(cols, "field2")
  };

  // Map each table row to our TwoFieldItem structure.
  const items: TwoFieldItem[] = table.rows.map((row, rIndex) => {
    // Selection ID allows click selection (cross-filtering) in the report.
    const identity = host.createSelectionIdBuilder().withTable(table, rIndex).createSelectionId();

    return {
      field1: idx.field1 !== undefined ? toStr(row[idx.field1]) : undefined,
      field2: idx.field2 !== undefined ? toStr(row[idx.field2]) : undefined,
      identity
    };
  });

  return { items, settings };
}