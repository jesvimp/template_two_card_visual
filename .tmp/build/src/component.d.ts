import * as React from "react";
type Role = "user" | "assistant";
export interface Message {
    text: string;
    role: Role;
    time?: string;
}
export interface State {
    messages: Message[];
    draft: string;
    loading: boolean;
    conversationId?: string;
    error?: string | null;
}
export type ChatProps = {
    categoryPreview?: string;
    valuesPreview?: string;
};
export default class ReactCircleCard extends React.Component<ChatProps, State> {
    private scrollRef;
    constructor(props: ChatProps);
    private scrollToBottom;
    componentDidMount(): void;
    componentDidUpdate(): void;
    private onKeyDown;
    private onChangeDraft;
    private appendMessage;
    private replaceLastAssistantWith;
    private callApi;
    private onSend;
    render(): React.JSX.Element;
}
export {};
