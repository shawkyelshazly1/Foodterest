import { isAuthenticated } from "../../middlewares/auth.js";
import consola from "consola";
import Post from "../../models/post.js";
import { UserInputError, AuthenticationError } from "apollo-server-express";
import Comment from "../../models/comment.js";
import { validateCommentInput } from "../../utils/validation.js";

const commentResolver = {
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

        return await newComment.save();
      } catch (error) {
        console.error(error);
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
        return await commentFound.remove();
      } catch (error) {
        consola.error(error);
        throw new Error("Something Went Wrong.");
      }
    },
  },
};

export default commentResolver;
