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
import {
  boardLoader,
  commentsCountLoader,
  postLikeLoader,
  postLoader,
  userLoader,
} from "../dataLoaders.js";
import boardResolver from "./board.js";

const resolvers = {
  Post: {
    author: async (parent, __) => {
      const user = await userLoader.load(parent.authorId.toString());
      // const user = await User.findById(parent.authorId);
      return user;
    },

    likesCount: async (parent, __) => {
      return await postLikeLoader.load(parent._id.toString());

      // return await PostLike.countDocuments({ postId: parent._id });
    },

    commentsCount: async (parent, __) => {
      return await commentsCountLoader.load(parent._id.toString());
    },

    liked: async (parent, __, { postLikedLoader }) => {
      return await postLikedLoader.load(parent._id.toString());
    },

    comments: async (parent, __) => {
      const comments = await Comment.find({ postId: parent._id }).sort({
        createdAt: -1,
      });
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

    boards: async (parent, _, __) => {
      return await boardLoader.load(parent._id);
    },
  },

  Comment: {
    // load comment author
    author: async (parent, __) => {
      const user = await User.findById(parent.authorId);
      return user;
    },
  },

  Board: {
    posts: async (parent, _) => {
      return parent.posts.map(async (postId) => await postLoader.load(postId));
    },

    author: async (parent, _) => {
      return await userLoader.load(parent.userId.toString());
    },

    postsCount: async (parent, _) => {
      return parent.posts.length;
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
    ...boardResolver.Query,
  },

  Mutation: {
    ...authResolver.Mutation,
    ...postResolver.Mutation,
    ...commentResolver.Mutation,
    ...userResolver.Mutation,
    ...boardResolver.Mutation,
  },
};

export default resolvers;
