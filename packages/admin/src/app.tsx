import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { trpc, trpcClient } from "@/lib/trpc";

import { routeTree } from "./routeTree.gen";

import "./index.css";
import { queryClient } from "./lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

const router = createRouter({
  routeTree,
  context: { client: undefined!, user: null },
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
          <App />
        </QueryClientProvider>
      </trpc.Provider>
    </StrictMode>,
  );
}

// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const client = trpc.useUtils().client;

  return <RouterProvider router={router} context={{ client }} />;
}
