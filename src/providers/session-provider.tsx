"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  signIn as signInAction,
  signOut as signOutAction,
  signUp as signUpAction,
  verifyToken,
} from "@/lib/actions";

type User = {
  id: number;
  full_name: string;
  email: string;
  is_active: boolean;
};

type Session = {
  accessToken: string;
  user: User;
} | null;

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

type SignInData = {
  email: string;
  password: string;
};

type SignUpData = {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
};

interface SessionContextType {
  session: Session;
  status: SessionStatus;
  setSession: (session: Session) => void;
  clearSession: () => void;
  signIn: (data: SignInData) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch("/api/token");

        if (response.ok) {
          const data = (await response.json()) as { access_token?: string };
          if (data.access_token) {
            const verifyResult = await verifyToken(data.access_token);

            if (verifyResult.success) {
              setSessionState({
                accessToken: data.access_token,
                user: verifyResult.data,
              });
              setStatus("authenticated");
              return;
            }
          }
        }

        setSessionState(null);
        setStatus("unauthenticated");
      } catch {
        setSessionState(null);
        setStatus("unauthenticated");
      }
    }

    loadSession();
  }, []);

  const setSession = useCallback((newSession: Session) => {
    setSessionState(newSession);
    setStatus(newSession ? "authenticated" : "unauthenticated");
  }, []);

  const clearSession = useCallback(() => {
    setSessionState(null);
    setStatus("unauthenticated");
  }, []);

  const signIn = useCallback(async (data: SignInData) => {
    const result = await signInAction(data);

    if (result.success) {
      const verifyResult = await verifyToken(result.data.access_token);

      if (verifyResult.success) {
        setSessionState({
          accessToken: result.data.access_token,
          user: verifyResult.data,
        });
        setStatus("authenticated");
        return { success: true };
      }

      return { success: false, error: verifyResult.error };
    }

    return { success: false, error: result.error };
  }, []);

  const signUp = useCallback(async (data: SignUpData) => {
    const result = await signUpAction(data);

    if (result.success) {
      const verifyResult = await verifyToken(result.data.access_token);

      if (verifyResult.success) {
        setSessionState({
          accessToken: result.data.access_token,
          user: verifyResult.data,
        });
        setStatus("authenticated");
        return { success: true };
      }

      return { success: false, error: verifyResult.error };
    }

    return { success: false, error: result.error };
  }, []);

  const signOut = useCallback(async () => {
    const result = await signOutAction();

    if (result.success) {
      setSessionState(null);
      setStatus("unauthenticated");
      return { success: true };
    }

    return { success: false, error: result.error };
  }, []);

  return (
    <SessionContext.Provider
      value={{
        session,
        status,
        setSession,
        clearSession,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
