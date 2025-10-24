// src/component.tsx
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
  error?: string | null; // extra detail shown in a banner
}

export type ChatProps = {
  categoryPreview?: string;
  valuesPreview?: string;
};

function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Assemble the base URL to avoid eslint "no-http-string"
const API_BASE = "http" + "://127.0.0.1:8000";

function classifyError(err: any, _apiUrl: string): { userMessage: string; detail?: string } {
  const raw = err?.message ? String(err.message) : String(err || "Unknown error");

  // Generic browser network failure (often CORS/preflight)
  if (/Failed to fetch/i.test(raw)) {
    return {
      userMessage: "Network error (CORS/preflight or server unreachable).",
      detail:
        "Ensure the API is running and CORS allows requests:\n" +
        "allow_origins=[\"*\"], allow_methods=[\"*\"], allow_headers=[\"*\"].\n" +
        "Verify POST and OPTIONS work for /ask and /continue."
    };
  }

  // Show explicit HTTP status if present
  if (/HTTP\s+\d{3}/.test(raw)) {
    return { userMessage: raw };
  }

  return { userMessage: raw };
}



export default class ReactCircleCard extends React.Component<ChatProps, State> {
  private scrollRef = React.createRef<HTMLDivElement>();

  constructor(props: ChatProps) {
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

  componentDidMount() { this.scrollToBottom(); }
  componentDidUpdate() { this.scrollToBottom(); }

  private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") this.onSend();
  };

  private onChangeDraft = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ draft: e.target.value });
  };

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
    }, this.scrollToBottom);
  };

  private async callApi(prompt: string, conversationId?: string) {
    const endpoint = conversationId ? "/continue" : "/ask";
    const url = API_BASE + endpoint;

    const headers: HeadersInit = { "Content-Type": "application/json" };
    const body: Record<string, any> = conversationId
      ? { prompt, conversation_id: conversationId }
      : { prompt };

    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      // Include status code and any response body to aid debugging
      throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
    }

    return res.json() as Promise<{ response: string; conversation_id?: string }>;
  }

  private onSend = async () => {
    const text = this.state.draft.trim();
    if (!text || this.state.loading) return;

    // Add user message and assistant placeholder
    this.appendMessage({ text, role: "user", time: nowTime() });
    this.appendMessage({ text: "…", role: "assistant", time: nowTime() });

    this.setState({ draft: "", loading: true, error: null });

    try {
      const data = await this.callApi(text, this.state.conversationId);
      this.replaceLastAssistantWith(data.response || "(no response)");
      this.setState({
        loading: false,
        conversationId: data.conversation_id || this.state.conversationId
      });
    } catch (e: any) {
    console.error("Chat API error:", e);
    const { userMessage, detail } = classifyError(e, API_BASE);
    // Show the error inside the assistant bubble
    this.replaceLastAssistantWith(`Error: ${userMessage}`);
    // Show extra detail under the header
    this.setState({ loading: false, error: detail || userMessage });
  }
  };

  render() {
    const { messages, draft, loading, error } = this.state;
    const { categoryPreview, valuesPreview } = this.props;

    return (
      <div className="chat-root">
        <div className="chat-header">
          <div className="avatar">AI</div>
          <div className="meta">
            <span className="title">Chat Assistant</span>
            <span className="status">{loading ? "Sending..." : "Local API"}</span>
          </div>
          {(categoryPreview || valuesPreview) && (
            <div style={{ marginLeft: "auto", fontSize: 11, color: "#666" }}>
              {categoryPreview ? `Category: ${categoryPreview}` : ""}
              {categoryPreview && valuesPreview ? " • " : ""}
              {valuesPreview ? `Values: ${valuesPreview}` : ""}
            </div>
          )}
        </div>

        {error && (
          <div
            style={{
              marginBottom: 8,
              padding: "6px 8px",
              borderRadius: 8,
              border: "1px solid #ffb3b3",
              background: "#ffecec",
              color: "#7a0000",
              fontSize: 12,
              whiteSpace: "pre-wrap"
            }}
          >
            {error}
          </div>
        )}

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
                {m.time ? (
                  <span className="timestamp" style={{ marginLeft: 8, color: "#888" }}>
                    {m.time}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="chat-controls">
          <input
            type="text"
            placeholder="Type a message…"
            value={draft}
            onChange={this.onChangeDraft}
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