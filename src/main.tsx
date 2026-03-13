import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import "./index.css";
import App from "./App.tsx";
import { StoreProvider } from "@/lib/store/context.tsx";
import { localStorageStore } from "@/lib/store/local-storage.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider store={localStorageStore}>
      <App />
    </StoreProvider>
  </StrictMode>,
);
