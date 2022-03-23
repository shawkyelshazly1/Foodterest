import authResolver from "./auth.js";
import postResolver from "./post.js";
import commentResolver from "./comment.js";
import { isAuthenticated } from "../../middlewares/auth.js";
import User from "../../models/user.js";
import PostLike from "../../models/postLike.js";
import Comment from "../../models/comment.js";
import Post from "../../models/post.js";
import userResolver from "./user.js";

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
    posts: async (parent, __) => {
      const posts = await Post.find({ authorId: parent.id });
      return posts;
    },
  },

  Comment: {
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
  },
};

export default resolvers;
