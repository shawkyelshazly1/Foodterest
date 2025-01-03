import { useEffect, useState } from "react";
import RoutesProvider from "./RoutesProvider";
import { setAccessToken } from "./utils/auth";

function App() {
	const [loading, setLoading] = useState(true);

	// Fetching access token on page reload/refresh using the refresh token otherwise will be logged out
	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/refresh_token`, {
			method: "POST",
			credentials: "include",
		}).then(async (res) => {
			const { accessToken } = await res.json();
			setAccessToken(accessToken);
			setLoading(false);
		});
	}, []);

	if (loading) {
		return null;
	}

	return <RoutesProvider />;
}

export default App;
