import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import "./styles/globals.css";
import { Toaster } from 'react-hot-toast'

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThirdwebProvider activeChain={ChainId.Mumbai}>
      <App />
      <Toaster />
    </ThirdwebProvider>
  </React.StrictMode>
);
