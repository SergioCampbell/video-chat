import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./Context/SocketProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <div className="app-container">
        <App />
        </div>
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);
