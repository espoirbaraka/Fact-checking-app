import type { ChatSession, User } from "@/types";

export const MOCK_USER: User = {
  id: "user-1",
  name: "Espoir Nord-Kivu",
  email: "demo@nordkivu.cd",
  avatar: undefined,
  role: "user",
};

export const MOCK_CHAT_HISTORY: Pick<ChatSession, "id" | "title" | "updatedAt">[] =
  [];
