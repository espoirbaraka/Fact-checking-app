import api, { unwrapData } from "@/services/api";
import type {
  AIModel,
  ChatMessage,
  ChatSession,
  FactCheckResult,
} from "@/types";

interface SendMessageParams {
  sessionId: string | null;
  content: string;
  model: AIModel;
  plugin?: string;
  file?: File;
  language?: string;
}

interface BackendMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  factCheck?: FactCheckResult;
}

interface BackendConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatReplyPayload {
  conversationId: string;
  userMessage: BackendMessage;
  assistantMessage: BackendMessage;
  confidence: number;
}

export async function* streamText(
  text: string
): AsyncGenerator<string, void, unknown> {
  const words = text.split(" ");
  for (let i = 0; i < words.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 18 + Math.random() * 25));
    yield (i === 0 ? "" : " ") + words[i];
  }
}

export const chatService = {
  async getSessions(): Promise<ChatSession[]> {
    const response = await api.get("/conversations");
    const conversations = unwrapData<BackendConversation[]>(response);
    return conversations.map((c) => ({
      id: c.id,
      title: c.title,
      messages: [],
      model: "qwen" as AIModel,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  },

  async getSession(id: string): Promise<ChatSession | null> {
    const [convRes, msgRes] = await Promise.all([
      api.get(`/conversations/${id}`),
      api.get(`/messages/conversation/${id}`),
    ]);
    const conversation = unwrapData<BackendConversation>(convRes);
    const messages = unwrapData<BackendMessage[]>(msgRes);

    return {
      id: conversation.id,
      title: conversation.title,
      model: "qwen",
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      })),
    };
  },

  async createSession(_model: AIModel): Promise<ChatSession> {
    const response = await api.post("/conversations", {
      title: "Nouvelle vérification",
    });
    const conversation = unwrapData<BackendConversation>(response);
    return {
      id: conversation.id,
      title: conversation.title,
      messages: [],
      model: _model,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  },

  async sendMessage({
    sessionId,
    content,
    file,
    language = "fr",
  }: SendMessageParams): Promise<ChatMessage & { conversationId: string }> {
    let response;
    if (file) {
      const form = new FormData();
      form.append("file", file);
      if (content.trim()) {
        form.append("message", content.trim());
      }
      if (sessionId) {
        form.append("conversationId", sessionId);
      }
      form.append("language", language);
      response = await api.post("/ai/chat/upload", form, {
        timeout: 180000,
      });
    } else {
      response = await api.post("/ai/chat", {
        message: content,
        conversationId: sessionId ?? undefined,
        language,
      });
    }
    const data = unwrapData<ChatReplyPayload>(response);
    const assistant = data.assistantMessage;

    return {
      id: assistant.id,
      role: "assistant",
      content: assistant.content,
      createdAt: assistant.createdAt,
      factCheck: assistant.factCheck,
      conversationId: data.conversationId,
    };
  },

  async deleteSession(id: string): Promise<void> {
    await api.delete(`/conversations/${id}`);
  },
};
