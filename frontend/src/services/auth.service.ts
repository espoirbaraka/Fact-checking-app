import api, { unwrapData } from "@/services/api";
import type { User } from "@/types";

interface BackendUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: BackendUser;
}

function mapUser(user: BackendUser): User {
  return {
    id: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`.trim(),
    role: "user",
  };
}

function persistTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
}

export const authService = {
  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const response = await api.post("/auth/login", { email, password });
    const data = unwrapData<AuthPayload>(response);
    persistTokens(data.accessToken, data.refreshToken);
    return { user: mapUser(data.user), token: data.accessToken };
  },

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const response = await api.post("/auth/register", {
      firstName,
      lastName,
      email,
      password,
    });
    const data = unwrapData<AuthPayload>(response);
    persistTokens(data.accessToken, data.refreshToken);
    return { user: mapUser(data.user), token: data.accessToken };
  },

  async getProfile(): Promise<User> {
    const response = await api.get("/auth/me");
    const data = unwrapData<BackendUser>(response);
    return mapUser(data);
  },

  /**
   * Ensures a session exists for chat. Creates a demo account if needed.
   */
  async ensureSession(): Promise<{ user: User; token: string }> {
    const existing =
      typeof window !== "undefined"
        ? localStorage.getItem("auth_token")
        : null;

    if (existing) {
      try {
        const user = await this.getProfile();
        return { user, token: existing };
      } catch {
        // fall through to demo login
      }
    }

    const email = "demo@nordkivu.cd";
    const password = "DemoPass123!";

    try {
      return await this.login(email, password);
    } catch {
      return await this.register("Espoir", "Nord-Kivu", email, password);
    }
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
    }
  },
};
