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
}
interface Props {
    item: TwoFieldItem;
    settings: CardVisualSettings;
    selected?: boolean;
    onClick?: (e: React.MouseEvent) => void;
}
export declare const TwoFieldCard: React.FC<Props>;
export {};
