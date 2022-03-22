import { useEffect, useState } from "react";
import RoutesProvider from "./RoutesProvider";
import { setAccessToken } from "./utils/auth";
import LoadingComponent from "./components/reusable/LoadingComponent";

function App() {
  const [loading, setLoading] = useState(true);

  // Fetching access token on page reload/refresh using the refresh token otherwise will be logged out
  useEffect(() => {
    fetch("http://localhost:4000/refresh_token", {
      method: "POST",
      credentials: "include",
    }).then(async (res) => {
      const { accessToken } = await res.json();
      setAccessToken(accessToken);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center">
        <LoadingComponent />
      </div>
    );
  }

  return <RoutesProvider />;
}

export default App;
