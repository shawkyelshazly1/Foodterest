import authResolver from "./auth.js";
import { isAuthenticated } from "../../middlewares/auth.js";

const resolvers = {
  Query: {
    async hello(_, __, ctx) {
      await isAuthenticated(ctx);
      return "Hello from GraphQL";
    },
  },
  Mutation: {
    ...authResolver.Mutation,
  },
};

export default resolvers;
