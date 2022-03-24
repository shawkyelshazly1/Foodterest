import authResolver from "./auth.js";
import postResolver from "./post.js";
import commentResolver from "./comment.js";
import { isAuthenticated } from "../../middlewares/auth.js";
import User from "../../models/user.js";
import PostLike from "../../models/postLike.js";
import Comment from "../../models/comment.js";
import Post from "../../models/post.js";
import userResolver from "./user.js";
import Following from "../../models/following.js";
import Follower from "../../models/follower.js";

const resolvers = {
  Post: {
    author: async (parent, __) => {
      const user = await User.findById(parent.authorId);
      return user;
    },

    likesCount: async (parent, __) => {
      return await PostLike.countDocuments({ postId: parent._id });
    },

    commentsCount: async (parent, __) => {
      return await Comment.countDocuments({ postId: parent._id });
    },

    liked: async (parent, __, { req }) => {
      const like = await PostLike.findOne({
        $and: [{ postId: parent._id }, { authorId: req.payload.userId }],
      });
      if (like) {
        return true;
      } else {
        return false;
      }
    },

    comments: async (parent, __) => {
      const comments = await Comment.find({ postId: parent._id });
      return comments;
    },
  },

  User: {
    // Get user posts
    posts: async (parent, __) => {
      const posts = await Post.find({ authorId: parent.id });
      return posts;
    },

    // check if loaded user is followed or not
    followed: async (parent, __, ctx) => {
      const currentUserId = ctx.req.payload.userId;
      const followFound = await Following.findOne({
        $and: [{ user: currentUserId }, { target: parent._id }],
      });

      if (followFound) {
        return true;
      } else {
        return false;
      }
    },

    // Get number of followers for loaded user
    followersCount: async (parent, _, __) => {
      const followersCount = await Follower.countDocuments({
        user: parent._id,
      });
      return followersCount;
    },

    // Get number of followings for loaded user
    followingsCount: async (parent, _, __) => {
      const followingCount = await Following.countDocuments({
        user: parent._id,
      });
      return followingCount;
    },
  },

  Comment: {
    // load comment author
    author: async (parent, __) => {
      const user = await User.findById(parent.authorId);
      return user;
    },
  },

  Query: {
    async hello(_, __, ctx) {
      await isAuthenticated(ctx);
      return "Hello from GraphQL";
    },
    ...postResolver.Query,
    ...userResolver.Query,
    ...commentResolver.Query,
  },

  Mutation: {
    ...authResolver.Mutation,
    ...postResolver.Mutation,
    ...commentResolver.Mutation,
    ...userResolver.Mutation,
  },
};

export default resolvers;
