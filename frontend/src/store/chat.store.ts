import { create } from "zustand";
import type { AIModel, ChatMessage, ChatSession } from "@/types";

interface ChatState {
  sessions: Pick<ChatSession, "id" | "title" | "updatedAt">[];
  activeSessionId: string | null;
  messages: ChatMessage[];
  selectedModel: AIModel;
  selectedPlugin: string | null;
  isLoading: boolean;
  isStreaming: boolean;
  sidebarOpen: boolean;
  sessionSearch: string;

  setSessions: (
    sessions: Pick<ChatSession, "id" | "title" | "updatedAt">[]
  ) => void;
  setActiveSession: (id: string | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  appendToMessage: (id: string, chunk: string) => void;
  setSelectedModel: (model: AIModel) => void;
  setSelectedPlugin: (plugin: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsStreaming: (streaming: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSessionSearch: (query: string) => void;
  clearChat: () => void;
  newChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  sessions: [],
  activeSessionId: null,
  messages: [],
  selectedModel: "qwen",
  selectedPlugin: "fact-check",
  isLoading: false,
  isStreaming: false,
  sidebarOpen: true,
  sessionSearch: "",

  setSessions: (sessions) => set({ sessions }),
  setActiveSession: (id) => set({ activeSessionId: id }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),
  appendToMessage: (id, chunk) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content: m.content + chunk } : m
      ),
    })),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setSelectedPlugin: (plugin) => set({ selectedPlugin: plugin }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsStreaming: (streaming) => set({ isStreaming: streaming }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSessionSearch: (query) => set({ sessionSearch: query }),
  clearChat: () =>
    set({ messages: [], activeSessionId: null, sessions: [], sessionSearch: "" }),
  newChat: () =>
    set({
      messages: [],
      activeSessionId: null,
    }),
}));
