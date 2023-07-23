import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthContextProvider from "./context/Auth/AuthContextProvider";

// Create a React root to render the application
const root = ReactDOM.createRoot(document.getElementById("root"));
// Render the application inside the root
root.render(
  // Wrap the entire application with the AuthContextProvider to provide authentication context
  <AuthContextProvider>
    <BrowserRouter>
      {/* Render the main App component */}
      <App />
    </BrowserRouter>
  </AuthContextProvider>
);
