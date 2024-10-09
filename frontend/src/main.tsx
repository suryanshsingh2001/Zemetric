import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/layout/theme-provider.tsx";
import { Toaster } from "sonner";
import { Header } from "./components/layout/Header.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Header />
      <App />
      <Toaster />
    </ThemeProvider>
  </StrictMode>
);
