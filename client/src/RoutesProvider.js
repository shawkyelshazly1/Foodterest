import React, { useEffect } from "react";
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
import CreatePost from "./pages/CreatePost";
import NotFound from "./pages/NotFound";
import BoardPage from "./pages/BoardPage";

export default function RoutesProvider() {
  return (
    <Router>
      <div className="container flex min-w-full min-h-screen ">
        <Routes>
          {/* <Route path="/" element={<Main />} /> */}
          <Route
            path="*"
            element={
              <>
                <PrivateRouter>
                  <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/posts/:postId" element={<PostPage />} />
                    <Route path="/profile/:username" element={<Profile />} />
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/boards/:boardId" element={<BoardPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PrivateRouter>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
