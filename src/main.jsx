import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import "./styles/globals.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThirdwebProvider activeChain={ChainId.Mumbai}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
