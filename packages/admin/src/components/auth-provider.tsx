/* eslint-disable react-refresh/only-export-components */
import { User } from "@thantko/common/types";
import { StoreApi, createStore, useStore } from "zustand";
import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "@tanstack/react-router";
import { trpc } from "@/lib/trpc";

export type AuthStore = {
  user: User | null;
  isCheckingAuth: boolean;
  actions: {
    onLoggedIn: (user: User) => void;
    onLoggedOut: () => void;
  };
};

export const authStoreContext = createContext<StoreApi<AuthStore> | null>(null);

export const AuthStoreProvider = ({ children }: { children: ReactNode }) => {
  const [store] = useState(() =>
    createStore<AuthStore>((set) => ({
      user: null,
      isCheckingAuth: true,
      actions: {
        onLoggedIn(user) {
          set({ user, isCheckingAuth: false });
        },
        onLoggedOut() {
          set({ user: null });
        },
      },
    })),
  );

  const client = trpc.useUtils().client;

  useEffect(() => {
    client.auth.me
      .query()
      .then((data) => store.getState().actions.onLoggedIn(data.user))
      .catch(() => store.getState().actions.onLoggedOut());
  }, [client.auth.me, store]);

  return (
    <authStoreContext.Provider value={store}>
      {children}
    </authStoreContext.Provider>
  );
};

export const useAuthStore = () => {
  const store = useContext(authStoreContext);
  if (!store) {
    throw new Error("Missing AuthStoreProvider in the component tree");
  }
  return useStore(store, (state) => ({
    ...state,
    isAuthenticated: !!state.user,
  }));
};
