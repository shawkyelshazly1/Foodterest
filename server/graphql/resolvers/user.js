import { AuthenticationError, UserInputError } from "apollo-server-express";
import User from "../../models/user.js";
import consola from "consola";
import { isAuthenticated } from "../../middlewares/auth.js";
import Follower from "../../models/follower.js";
import Following from "../../models/following.js";

const userResolver = {
  Query: {
    // Load current user data
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

    // query specific user profile
    async getUserProfile(_, { username }, ctx) {
      await isAuthenticated(ctx);
      try {
        const user = await User.findOne({ username });

        if (!user) {
          throw new UserInputError("User not found!");
        }

        return user;
      } catch (error) {
        consola.error(error);
        throw new AuthenticationError("Not Authenticated");
      }
    },
  },
  Mutation: {
    // Follow or unfollow user
    async followUser(_, { username }, ctx) {
      await isAuthenticated(ctx);
      const currentUserId = ctx.req.payload.userId;

      const userToFollow = await User.findOne({ username });
      const currentUser = await User.findById(currentUserId);

      if (!userToFollow) {
        throw new UserInputError("User not found.");
      }

      if (userToFollow._id === currentUser._id) {
        throw new Error("Not Authorized!");
      }

      try {
        const followFound = await Following.findOne({
          $and: [{ user: currentUser._id }, { target: userToFollow._id }],
        });

        if (followFound) {
          const deletedFollow = await Following.findOneAndDelete({
            $and: [{ user: currentUser._id }, { target: userToFollow._id }],
          });

          const deletedFollowing = await Follower.findOneAndDelete({
            $and: [{ user: userToFollow._id }, { target: currentUser._id }],
          });
        } else {
          try {
            const followAdded = await new Following({
              user: currentUser._id,
              target: userToFollow._id,
            });

            await followAdded.save();

            const followingAdded = await new Follower({
              user: userToFollow._id,
              target: currentUser._id,
            });

            await followingAdded.save();
          } catch (error) {
            consola.error(error);
            throw new Error("Something went wrong!");
          }
        }
      } catch (error) {
        consola.error(error);
        throw new Error("Something went wrong!");
      }

      return [currentUser, userToFollow];
    },
  },
};

export default userResolver;
