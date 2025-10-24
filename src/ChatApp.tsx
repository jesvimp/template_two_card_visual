// src/ChatApp.tsx
import * as React from "react";
import { Message } from "./component";

type ChatAppProps = {
  apiUrl?: string;
  viewport?: { width: number; height: number };
};

type ChatAppState = {
  messages: Message[];
  draft: string;
  loading: boolean;
  conversationId?: string;
  error?: string | null;
};

function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default class ChatApp extends React.Component<ChatAppProps, ChatAppState> {
  private scrollRef = React.createRef<HTMLDivElement>();

  constructor(props: ChatAppProps) {
    super(props);
    this.state = {
      messages: [
        { role: "assistant", text: "Hi there 👋\nType a message below.", time: nowTime() }
      ],
      draft: "",
      loading: false,
      error: null
    };
  }

  private scrollToBottom = () => {
    const el = this.scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }

  private setDraft = (text: string) => this.setState({ draft: text });

  private appendMessage = (msg: Message) => {
    this.setState((s) => ({ messages: [...s.messages, msg] }), this.scrollToBottom);
  };

  private replaceLastAssistantWith = (text: string) => {
    this.setState((s) => {
      const idx = [...s.messages]
        .map((m, i) => ({ m, i }))
        .reverse()
        .find((x) => x.m.role === "assistant")?.i;
      if (idx === undefined) return s;
      const copy = [...s.messages];
      copy[idx] = { ...copy[idx], text };
      return { ...s, messages: copy };
    });
  };

  private callApi = async (prompt: string, conversationId?: string) => {
    const apiUrl = (this.props.apiUrl || "").trim();
    if (!apiUrl) throw new Error("API URL is not configured in the visual’s formatting pane.");

    const headers: HeadersInit = {
      "Content-Type": "application/json"
    };

    const body: Record<string, any> = { prompt };
    if (conversationId) body.conversation_id = conversationId;

    const res = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`API error ${res.status}: ${text || res.statusText}`);
    }
    return res.json() as Promise<{ response: string; conversation_id?: string }>;
  };

  private onSend = async () => {
    const text = this.state.draft.trim();
    if (!text || this.state.loading) return;

    // Push user message
    const userMsg: Message = { role: "user", text, time: nowTime() };
    this.appendMessage(userMsg);

    // Push assistant placeholder (typing...)
    const placeholder: Message = { role: "assistant", text: "…", time: nowTime() };
    this.appendMessage(placeholder);

    this.setState({ draft: "", loading: true, error: null });

    try {
      const data = await this.callApi(text, this.state.conversationId);
      const answer = data.response || "(no response)";
      this.replaceLastAssistantWith(answer);
      this.setState({ loading: false, conversationId: data.conversation_id || this.state.conversationId });
    } catch (e: any) {
      this.replaceLastAssistantWith("TEST");
      this.setState({ loading: false, error: e?.message || "Unknown error" });
    }
  };

  private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") this.onSend();
  };

  render() {
    const { messages, draft, loading } = this.state;

    return (
      <div className="chat-root" style={{ height: "100%" }}>
        <div className="chat-header">
          <div className="avatar">AI</div>
          <div className="meta">
            <span className="title">Chat Assistant</span>
            <span className="status">{loading ? "Sending..." : "Ready"}</span>
          </div>
        </div>

        <div className="chat-messages" ref={this.scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`msg-row ${m.role}`}>
              <div className={`chat-message ${m.role}`}>
                {m.text.split("\n").map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < m.text.split("\n").length - 1 ? <br /> : null}
                  </span>
                ))}
                {m.time ? <span className="timestamp" style={{ marginLeft: 8, color: "#888" }}>{m.time}</span> : null}
              </div>
            </div>
          ))}
        </div>

        <div className="chat-controls">
          <input
            type="text"
            placeholder="Type a message…"
            value={draft}
            onChange={(e) => this.setDraft(e.target.value)}
            onKeyDown={this.onKeyDown}
            disabled={loading}
          />
          <button onClick={this.onSend} disabled={!draft.trim() || loading}>
            {loading ? "…" : "Send"}
          </button>
        </div>
      </div>
    );
  }
}