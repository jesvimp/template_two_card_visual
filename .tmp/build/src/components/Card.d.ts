import * as React from "react";
import { CardItem } from "../model";
export interface CardProps {
    item: CardItem;
    showLinkIcon: boolean;
    selected?: boolean;
    onClick?: () => void;
    onContextMenu?: (e: React.MouseEvent) => void;
    onOpenLink?: (url: string) => void;
    datePattern?: string;
}
export declare const LinkIcon: React.FC<{
    size?: number;
}>;
export declare const Card: React.FC<CardProps>;
