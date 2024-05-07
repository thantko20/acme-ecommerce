/* eslint-disable react-refresh/only-export-components */
import { User } from "@thantko/common/types";
import { StoreApi, createStore, useStore } from "zustand";
import { createContext, useContext, useState } from "react";
import { ReactNode } from "@tanstack/react-router";

export type AuthStore = {
  user: User | null;
  actions: {
    onLoggedIn: (user: User) => void;
    onLoggedOut: () => void;
  };
};

export const authStoreContext = createContext<StoreApi<AuthStore> | null>(null);

export const AuthStoreProvider = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) => {
  const [store] = useState(() =>
    createStore<AuthStore>((set) => ({
      user: initialUser,
      actions: {
        onLoggedIn(user) {
          set({ user });
        },
        onLoggedOut() {
          set({ user: null });
        },
      },
    })),
  );

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
