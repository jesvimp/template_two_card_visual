import * as React from "react";
import powerbi from "powerbi-visuals-api";
import ISelectionId = powerbi.extensibility.ISelectionId;
import { VisualSettings, CardItem } from "../model";
export interface CardStackProps {
    items: CardItem[];
    settings: VisualSettings;
    selectedKeySet: Set<string>;
    onSelect?: (id: ISelectionId, multi: boolean) => void;
    onContextMenu?: (id: ISelectionId, x: number, y: number) => void;
    onOpenLink?: (url: string) => void;
}
export declare const CardStack: React.FC<CardStackProps>;
