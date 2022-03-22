import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PrivateRouter from "./pages/PrivateRouter";
import Main from "./pages/Main";
import PostPage from "./pages/PostPage";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

export default function RoutesProvider() {
  return (
    <Router>
      <div className="container flex min-w-full min-h-screen">
        <Routes>
          {/* <Route path="/" element={<Main />} /> */}
          <Route
            path="*"
            element={
              <>
                <PrivateRouter>
                  <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/post/:postId" element={<PostPage />} />
                    <Route path="/profile/:userId" element={<Profile />} />
                  </Routes>
                </PrivateRouter>
              </>
            }
          />
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
      </div>
    </Router>
  );
}
