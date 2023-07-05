import jsonwebtoken from "jsonwebtoken";

//Sending Refresh Token in cookie
export async function sendRefreshToken(res, token) {
	res.cookie("jid", token, {
		httpOnly: false,
		path: "/refresh_token",
	});
}

// Generating refresh token
export async function generateRefreshToken(user) {
	const token = jsonwebtoken.sign(
		{ userId: user.id, tokenVersion: user.tokenVersion },
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: "7d",
		}
	);

	return token;
}

// Generating access token
export async function generateAccessToken(user) {
	const token = jsonwebtoken.sign(
		{ userId: user.id },
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "15m",
		}
	);
	return token;
}
