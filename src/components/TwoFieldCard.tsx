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
  onClick