import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "./authApi";
import {
  clearStoredAuthSession,
  getStoredAuthSession,
  isAuthSessionRemembered,
  setStoredAuthSession,
} from "./authStorage";
import type { AuthSession, AuthUser, LoginPayload, RegisterPayload } from "./auth.types";

type AuthStatus = "checking" | "authenticated" | "guest";

type AuthContextValue = {
  login: (payload: LoginPayload) => Promise<AuthSession>;
  logout: () => Promise<void>;
  registerStudent: (payload: RegisterPayload) => Promise<AuthUser>;
  session: AuthSession | null;
  status: AuthStatus;
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(() =>
    getStoredAuthSession(),
  );
  const [status, setStatus] = useState<AuthStatus>(
    session ? "checking" : "guest",
  );

  useEffect(() => {
    const storedSession = getStoredAuthSession();

    if (!storedSession) {
      setSession(null);
      setStatus("guest");
      return;
    }

    let isMounted = true;

    authApi
      .getCurrentUser(storedSession.token)
      .then(({ user }) => {
        if (!isMounted) {
          return;
        }

        const refreshedSession = {
          ...storedSession,
          user,
        };

        setStoredAuthSession(refreshedSession, isAuthSessionRemembered());
        setSession(refreshedSession);
        setStatus("authenticated");
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        clearStoredAuthSession();
        setSession(null);
        setStatus("guest");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }

    const expiresAtTime = Date.parse(session.expiresAt);

    if (Number.isNaN(expiresAtTime) || expiresAtTime <= Date.now()) {
      clearStoredAuthSession();
      setSession(null);
      setStatus("guest");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      clearStoredAuthSession();
      setSession(null);
      setStatus("guest");
    }, expiresAtTime - Date.now());

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [session]);

  const login = useCallback(async (payload: LoginPayload) => {
    const nextSession = await authApi.login(payload);

    setStoredAuthSession(nextSession, payload.remember);
    setSession(nextSession);
    setStatus("authenticated");

    return nextSession;
  }, []);

  const registerStudent = useCallback(async (payload: RegisterPayload) => {
    const { user } = await authApi.registerStudent(payload);
    return user;
  }, []);

  const logout = useCallback(async () => {
    const token = session?.token;

    clearStoredAuthSession();
    setSession(null);
    setStatus("guest");

    if (token) {
      await authApi.logout(token);
    }
  }, [session?.token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      login,
      logout,
      registerStudent,
      session,
      status,
      user: session?.user ?? null,
    }),
    [login, logout, registerStudent, session, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
