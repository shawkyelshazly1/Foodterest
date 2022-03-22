import { AuthenticationError } from "apollo-server-express";
import User from "../../models/user.js";
import consola from "consola";
import { isAuthenticated } from "../../middlewares/auth.js";

const userResolver = {
  Query: {
    async currentUser(_, __, ctx) {
      await isAuthenticated(ctx);
      const userId = ctx.req.payload.userId;
      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new AuthenticationError("Not Authenticated");
        }
        return user;
      } catch (error) {
        consola.error(error);
        throw new AuthenticationError("Not Authenticated");
      }
    },
  },
};

export default userResolver;
