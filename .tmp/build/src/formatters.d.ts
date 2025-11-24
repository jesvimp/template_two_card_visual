export type ParsedQuery = {
    language?: string;
    code: string;
};
export type ParsedTable = {
    headers: string[];
    rows: string[][];
};
export declare function parseCodeBlocks(text: string): ParsedQuery[];
export declare function stripCodeBlocks(text: string): string;
export declare function parseFirstMarkdownTable(text: string): ParsedTable | null;
