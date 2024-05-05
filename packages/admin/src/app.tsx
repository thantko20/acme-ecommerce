import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Theme, ThemePanel } from "@radix-ui/themes";

import { routeTree } from "./routeTree.gen";

import "@radix-ui/themes/styles.css";
import "./index.css";

const router = createRouter({ routeTree });

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
      <Theme>
        <RouterProvider router={router} />
        <ThemePanel defaultOpen={false} />
      </Theme>
    </StrictMode>,
  );
}
