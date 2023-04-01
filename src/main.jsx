import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppState } from "./context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppState>
      <ToastContainer />
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </AppState>
  </BrowserRouter>
);
