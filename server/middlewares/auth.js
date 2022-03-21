import jsonwebtoken from "jsonwebtoken";
import { AuthenticationError } from "apollo-server-express";
import consola from "consola";

// Middleware function to validate authentication
export async function isAuthenticated(ctx) {
  const authorization = ctx.req.headers["authorization"];

  // Checking if access token in headers
  if (!authorization) {
    throw new AuthenticationError("Not Authenticated");
  }

  try {
    //extracting token
    const accessToken = authorization.split(" ")[1];

    // validating token and extracting payload
    const payload = jsonwebtoken.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    // setting payload in req for ease access
    ctx.req.payload = payload;
    
  } catch (error) {
    consola.error(error);
    throw new AuthenticationError("Not Authenticated");
  }
}
