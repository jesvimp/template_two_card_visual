/**
 * TwoFieldCard.tsx
 * A tiny React component that renders a single "card" with two textual fields.
 * - You pass down the text values and the visual settings.
 * - Styling (colors, font size, backgrounds) comes from settings via inline styles for simplicity.
 */

import * as React from "react";

export interface FieldStyle {
  color: string;
  backgroundColor: string;
  fontSize: number; // px
}

export interface CardVisualSettings {
  cardBackground: string;
  padding: number;      // px
  cornerRadius: number; // px
  shadow: boolean;
  field1: FieldStyle;
  field2: FieldStyle;
}

export interface TwoFieldItem {
  field1?: string;
  field2?: string;
  // selection key is handled at parent level
}

interface Props {
  item: TwoFieldItem;
  settings: CardVisualSettings;
  selected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export const TwoFieldCard: React.FC<Props> = ({ item, settings, selected, onClick }) => {
  const cardStyle: React.CSSProperties = {
    background: settings.cardBackground,
    padding: settings.padding,
    borderRadius: settings.cornerRadius,
    boxShadow: settings.shadow ? "0 3px 10px rgba(0,0,0,0.12)" : "none",
    outline: selected ? "2px solid #0078D4" : "none"
  };

  const field1Style: React.CSSProperties = {
    color: settings.field1.color,
    background: settings.field1.backgroundColor,
    fontSize: settings.field1.fontSize
  };

  const field2Style: React.CSSProperties = {
    color: settings.field2.color,
    background: settings.field2.backgroundColor,
    fontSize: settings.field2.fontSize
  };

  return (
    <div className="card" style={cardStyle} onClick={onClick}>
      <div className="field" style={field1Style}>{item.field1 ?? ""}</div>
      <div className="field" style={field2Style}>{item.field2 ?? ""}</div>
    </div>
  );
};