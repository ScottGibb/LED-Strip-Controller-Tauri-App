import React from "react";
import ReactDOM from "react-dom/client";
import { Layout } from "./layouts";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";

const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  </React.StrictMode>,
);
