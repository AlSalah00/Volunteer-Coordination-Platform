import { StrictMode } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <AuthProvider>
        <ToastProvider>
          <NotificationProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </NotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </APIProvider>
  </StrictMode>,
);
