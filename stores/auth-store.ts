import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

import { deletePrivateAPI, initPrivateAPI } from "@/utils/fetcher";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_SESSION_KEY = "auth_session";

type AuthAcl = Record<string, true>;

export type LoginResponse = {
  acl: string[];
  activated: boolean;
  code: string;
  elapsed: number;
  email: string;
  expired: number;
  referral: string;
  status: string;
  token: string;
  user_id: string;
  username: string;
};

type AuthSession = Omit<
  LoginResponse,
  "acl" | "elapsed" | "expired" | "status" | "user_id"
> & {
  acl: AuthAcl;
  userId: string;
};

type AuthState = {
  authToken: string | null;
  acl: AuthAcl;
  activated: boolean;
  code: string | null;
  email: string | null;
  referral: string | null;
  userId: string | null;
  username: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hydrateAuth: () => Promise<void>;
  login: (session?: LoginResponse | string | null) => Promise<void>;
  register: (session?: LoginResponse | string | null) => Promise<void>;
  logout: () => Promise<void>;
};

const emptySession = {
  authToken: null,
  acl: {},
  activated: false,
  code: null,
  email: null,
  referral: null,
  userId: null,
  username: null,
};

const aclToMap = (acl: string[] = []) =>
  acl.reduce<AuthAcl>((mappedAcl, key) => {
    mappedAcl[key] = true;
    return mappedAcl;
  }, {});

const normalizeSession = (
  session: LoginResponse | string | null,
): AuthSession | null => {
  if (!session) {
    return null;
  }

  if (typeof session === "string") {
    return {
      acl: {},
      activated: true,
      code: "LOGIN_SUCCESS",
      email: "",
      referral: "",
      token: session,
      userId: "",
      username: "",
    };
  }

  return {
    acl: aclToMap(session.acl),
    activated: session.activated,
    code: session.code,
    email: session.email,
    referral: session.referral,
    token: session.token,
    userId: session.user_id,
    username: session.username,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...emptySession,
  isAuthenticated: false,
  isLoading: true,
  hydrateAuth: async () => {
    try {
      const rawSession = await SecureStore.getItemAsync(AUTH_SESSION_KEY);
      const fallbackToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      const session = rawSession
        ? (JSON.parse(rawSession) as AuthSession)
        : normalizeSession(fallbackToken);

      if (session?.token) {
        initPrivateAPI(session.token);
      } else {
        deletePrivateAPI();
      }

      set({
        ...emptySession,
        ...session,
        authToken: session?.token ?? null,
        isAuthenticated: Boolean(session?.token),
        isLoading: false,
      });
    } catch (error) {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
      deletePrivateAPI();

      set({
        ...emptySession,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
  login: async (sessionInput = null) => {
    const session = normalizeSession(sessionInput);

    if (session?.token) {
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, session.token);
      await SecureStore.setItemAsync(AUTH_SESSION_KEY, JSON.stringify(session));
      initPrivateAPI(session.token);
    } else {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
      deletePrivateAPI();
    }

    set({
      ...emptySession,
      ...session,
      authToken: session?.token ?? null,
      isAuthenticated: true,
      isLoading: false,
    });
  },
  register: async (sessionInput = null) => {
    const session = normalizeSession(sessionInput);

    if (session?.token) {
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, session.token);
      await SecureStore.setItemAsync(AUTH_SESSION_KEY, JSON.stringify(session));
      initPrivateAPI(session.token);
    } else {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
      deletePrivateAPI();
    }

    set({
      ...emptySession,
      ...session,
      authToken: session?.token ?? null,
      isAuthenticated: true,
      isLoading: false,
    });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
    deletePrivateAPI();

    set({
      ...emptySession,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
