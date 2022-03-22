import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import jwtDecode from "jwt-decode";
import { getAccessToken, setAccessToken } from "./utils/auth";
import { TokenRefreshLink } from "apollo-link-token-refresh";

// Setting up the custom refresh link where localstorage empty but refresh token in cookie to retrieve new access token
const refreshLink = new TokenRefreshLink({
  // Setting name for token field
  accessTokenField: "accessToken",

  // Validating if token valid or not on frontend
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();
    // If token doesn't exist
    if (!token) {
      return true;
    }

    try {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      return false;
    }
  },

  // Fetch New Access Token
  fetchAccessToken: () => {
    return fetch("http://localhost:4000/refresh_token", {
      method: "POST",
      credentials: "include",
    });
  },

  // Handle Fetch result "saving access token in localstorage"
  handleFetch: (accessToken) => {
    setAccessToken(accessToken);
  },

  // handleError
  handleError: (err) => {
    console.error(err);
    client.resetStore();
  },
});

// Setup the basic http link for connection
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

// Setup auth link
const authLink = setContext((_, { prevHeaders }) => {
  const accessToken = getAccessToken();
  return {
    headers: {
      ...prevHeaders,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

// Init apollo client instance with custom link with error fallback for authentication
const client = new ApolloClient({
  link: from([refreshLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
