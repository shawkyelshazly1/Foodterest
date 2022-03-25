import { isAuthenticated } from "../../middlewares/auth.js";
import consola from "consola";
import Post from "../../models/post.js";
import { UserInputError, AuthenticationError } from "apollo-server-express";
import Comment from "../../models/comment.js";
import { validateCommentInput } from "../../utils/validation.js";
import { commentsCountLoader, postLoader } from "../dataLoaders.js";

const commentResolver = {
  Query: {
    //Load post comments
    async getPostComments(_, { postId }, ctx) {
      // Authentication middleware
      await isAuthenticated(ctx);

      let postFound = "";
      try {
        postFound = await Post.findById(postId);
      } catch (error) {
        consola.error(error);
        throw new Error("Something went Wrong");
      }

      if (!postFound) {
        throw new UserInputError("Post not found");
      }

      try {
        const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
        return comments;
      } catch (error) {
        consola.error(error);
        throw new Error("Something Went Wrong.");
      }
    },
  },
  Mutation: {
    // add comment mutation
    async addComment(_, { postId, content }, ctx) {
      // Authentication middleware
      await isAuthenticated(ctx);

      await validateCommentInput({ content });

      // Validating if post found
      let postFound = "";
      try {
        postFound = await Post.findById(postId);
      } catch (error) {
        consola.error(error);
        throw new Error("Something went Wrong");
      }

      if (!postFound) {
        throw new UserInputError("Post not found");
      }
      try {
        const newComment = await new Comment({
          postId,
          content,
          authorId: ctx.req.payload.userId,
        });
        // Clearing data loaders
        postLoader.clear(postId.toString());
        commentsCountLoader.clear(postId.toString());

        await newComment.save();

        return postFound;
      } catch (error) {
        consola.error(error);
        throw new Error("Something Went Wrong.");
      }
    },

    // delete comment mutation
    async deleteComment(_, { commentId }, ctx) {
      await isAuthenticated(ctx);

      let commentFound = "";

      try {
        commentFound = await Comment.findById(commentId);
      } catch (error) {
        consola.error(error);
        throw new Error("Something Went Wrong.");
      }

      if (!commentFound) {
        throw new UserInputError("Comment not found!");
      }

      if (commentFound.authorId.toString() !== ctx.req.payload.userId) {
        throw new AuthenticationError("Not Authorized.");
      }

      try {
        // Clearing data loaders
        postLoader.clear(commentFound.postId.toString());
        commentsCountLoader.clear(commentFound.postId.toString());

        return await commentFound.remove();
      } catch (error) {
        consola.error(error);
        throw new Error("Something Went Wrong.");
      }
    },
  },
};

export default commentResolver;
