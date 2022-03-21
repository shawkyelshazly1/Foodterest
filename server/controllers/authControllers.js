import { AuthenticationError } from "apollo-server-express";
import jsonwebtoken from "jsonwebtoken";
import User from "../models/user.js";
import {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
} from "../utils/auth.js";

export async function refreshTokenController(req, res) {
  const refreshToken = req.cookies.jid;

  // If no refresh token send empty access token
  if (!refreshToken) {
    return res.send({ ok: false, accessToken: "" });
  }

  let payload = "";

  try {
    //extracting payload from token
    payload = jsonwebtoken.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (error) {
    return res.send({ ok: false, accessToken: "" });
  }

  //if valid refresh token search for user in DB
  const user = await User.findById(payload.userId);

  if (!user) {
    return res.send({ ok: false, accessToken: "" });
  }

  if (payload.tokenVersion !== user.tokenVersion) {
    return res.send({ ok: false, accessToken: "" });
  }

  await sendRefreshToken(res, await generateRefreshToken(user));

  return res.send({ ok: true, accessToken: await generateAccessToken(user) });
}
