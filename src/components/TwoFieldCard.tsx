/**
 * TwoFieldCard.tsx
 * Purpose:
 * - Show one small "card" with two pieces of text (field1 and field2).
 * - All visual choices (colors, font sizes, backgrounds) come from settings
 *   so users can change them in the Power BI Format pane.
 *
 * How to read this file:
 * - Interfaces at the top describe the data and settings the component needs.
 * - The React component receives "props" (item, settings, selected, onClick).
 * - We build small "style objects" and pass them inline to the JSX below.
 */

import * as React from "react";

/* 1) Types for styling: we keep it very small and explicit */
export interface FieldStyle {
  color: string;            // text color (e.g., "#111111")
  backgroundColor: string;  // background behind the text (e.g., "transparent" or "#FFEECC")
  fontSize: number;         // font size in pixels (we pass numbers -> React treats as px)
}

/* 2) All card-level settings + both field styles */
export interface CardVisualSettings {
  cardBackground: string; // overall card background color
  padding: number;        // inner spacing in px
  cornerRadius: number;   // rounded corners in px
  shadow: boolean;        // show a soft shadow under the card
  field1: FieldStyle;     // style for the first line of text
  field2: FieldStyle;     // style for the second line of text
}

/* 3) One row of data: each field is optional (can be missing) */
export interface TwoFieldItem {
  field1?: string;
  field2?: string;
  // selection key/identity is handled by the parent component (visual.tsx)
}

/* 4) Props that this component expects from its parent */
interface Props {
  item: TwoFieldItem;                 // the actual values to display
  settings: CardVisualSettings;       // how the card should look
  selected?: boolean;                 // if true, we draw a selection outline
  onClick?: (e: React.MouseEvent) => void; // click handler (parent wires selection here)
}

/**
 * TwoFieldCard
 * - React.FC<Props> means a functional component that uses "Props".
 * - We compute small style objects (typed as React.CSSProperties),
 *   then apply them directly to the elements via the "style" prop.
 */
export const TwoFieldCard: React.FC<Props> = ({ item, settings, selected, onClick }) => {
  // Card container styles (box, padding, radius, optional shadow, selection outline)
  const cardStyle: React.CSSProperties = {
    background: settings.cardBackground,
    padding: settings.padding,              // number -> React interprets as "px"
    borderRadius: settings.cornerRadius,    // number -> "px"
    boxShadow: settings.shadow ? "0 3px 10px rgba(0,0,0,0.12)" : "none",
    outline: selected ? "2px solid #0078D4" : "none" // show a blue outline if selected
  };

  // Field 1 styles (comes from Format pane via settings)
  const field1Style: React.CSSProperties = {
    color: settings.field1.color,
    background: settings.field1.backgroundColor,
    fontSize: settings.field1.fontSize     // number -> "px"
  };

  // Field 2 styles (also fully controlled via Format pane)
  const field2Style: React.CSSProperties = {
    color: settings.field2.color,
    background: settings.field2.backgroundColor,
    fontSize: settings.field2.fontSize
  };

  return (
    // The outer card box; parent passes onClick for selection handling
    <div className="card" style={cardStyle} onClick={onClick}>
      {/* Each field uses its own style; "?? ''" shows empty string if value is missing */}
      <div className="field" style={field1Style}>{item.field1 ?? ""}</div>
      <div className="field" style={field2Style}>{item.field2 ?? ""}</div>
    </div>
  );
};