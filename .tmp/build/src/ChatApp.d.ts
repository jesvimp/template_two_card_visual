import * as React from "react";
import { Message } from "./component";
type ChatAppProps = {
    apiUrl?: string;
    viewport?: {
        width: number;
        height: number;
    };
};
type ChatAppState = {
    messages: Message[];
    draft: string;
    loading: boolean;
    conversationId?: string;
    error?: string | null;
};
export default class ChatApp extends React.Component<ChatAppProps, ChatAppState> {
    private scrollRef;
    constructor(props: ChatAppProps);
    private scrollToBottom;
    componentDidMount(): void;
    componentDidUpdate(): void;
    private setDraft;
    private appendMessage;
    private replaceLastAssistantWith;
    private callApi;
    private onSend;
    private onKeyDown;
    render(): React.JSX.Element;
}
export {};
