import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { trpc, trpcClient } from "@/lib/trpc";

import { AuthStoreProvider, useAuthStore } from "./components/auth-provider";
import "./index.css";
import { queryClient } from "./lib/react-query";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  context: { client: undefined!, auth: undefined! },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <AuthStoreProvider>
            <App />
          </AuthStoreProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </StrictMode>,
  );
}

// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const client = trpc.useUtils().client;
  const { user, isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>We are determining whether we should accept you or not</p>
      </div>
    );
  }

  return (
    <RouterProvider
      router={router}
      context={{ client, auth: { user, isAuthenticated } }}
    />
  );
}
