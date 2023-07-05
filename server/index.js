import express from "express";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import consola from "consola";
import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers/index.js";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { refreshTokenController } from "./controllers/authControllers.js";
import DataLoader from "dataloader";
import { loadLiked } from "./graphql/dataLoaders.js";

// Setting Enviromental variables with dotenv
dotenv.config();

(async () => {
	// Initializing the express App instance
	const app = express();

	app.use(express.json({ limit: "50mb" }));

	// Setting Cors & CookieParser
	app.use(
		cors({
			origin: "http://localhost:3000",
			credentials: true,
		})
	);
	app.use(cookieParser());

	// Setting refresh token route
	app.post("/refresh_token", refreshTokenController);

	// Imprting GraphQL schema

	// Initializing the APolloserver instance
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req, res }) => ({
			req,
			res,
			postLikedLoader: new DataLoader((keys) => loadLiked(keys, req)),
		}),
		plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
	});

	// Starting the Apollo server
	await server.start();

	// Adding express app as middle ware for Apollo server
	server.applyMiddleware({ app, cors: false });

	//   Starting Mongoose Connection
	mongoose
		.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then((_) => {
			consola.success(`Connection to MongoDB Success.`);
			app.listen(process.env.PORT, () => {
				consola.success(
					`Server started on : http://localhost:${process.env.PORT}`
				);
				consola.success(
					`Graphql playground connected & started on : http://localhost:${process.env.PORT}/graphql`
				);
			});
		})
		.catch((err) => {
			consola.error(`Connection to MongoDB Failed with Error: ${err}`);
		});
})();
