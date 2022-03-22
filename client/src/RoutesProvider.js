import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Main from "./pages/Main";

export default function RoutesProvider() {
  return (
    <Router>
      <div className="container flex min-w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Main />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
