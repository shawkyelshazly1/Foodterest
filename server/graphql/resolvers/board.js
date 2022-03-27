import { isAuthenticated } from "../../middlewares/auth.js";
import Board from "../../models/board.js";
import { boardLoader, postLoader, publicBoardLoader } from "../dataLoaders.js";
import { UserInputError } from "apollo-server-express";
import User from "../../models/user.js";
import { validateBoardInput } from "../../utils/validation.js";

const boardResolver = {
  Query: {
    // Getting user Boards
    async getUserBoards(_, { userId }, ctx) {
      await isAuthenticated(ctx);
      const currentUserId = ctx.req.payload.userId;
      const user = await User.findById(userId);

      if (!user) {
        throw new UserInputError("User not found!");
      }

      let boards = [];

      if (user._id.toString() !== currentUserId) {
        boards = await publicBoardLoader.load(userId);
      } else {
        boards = await boardLoader.load(userId);
      }

      if (!boards) {
        return [];
      } else {
        return boards;
      }
    },

    // Getting board posts
    async getBoard(_, { boardId }, ctx) {
      await isAuthenticated(ctx);

      try {
        const board = await Board.findById(boardId);
        if (!board) {
          throw new UserInputError("Board not found");
        }

        return board;
      } catch (error) {
        throw new Error("Something went wrong");
      }
    },
  },
  Mutation: {
    // Create baord mutation
    async createBoard(_, { title, privacy }, ctx) {
      await isAuthenticated(ctx);
      const currentUserId = ctx.req.payload.userId;

      // validate input against schema
      await validateBoardInput({ title, privacy });

      const boardFound = await Board.findOne({
        $and: [{ title }, { userId: currentUserId }],
      });

      if (boardFound) {
        throw new UserInputError("Board Exists", { boardId: boardFound._id });
      }
      publicBoardLoader.clear(currentUserId);
      boardLoader.clear(currentUserId);
      const newBoard = await new Board({
        title,
        userId: currentUserId,
        privacy,
      });

      return await newBoard.save();
    },
    // Add post to board mutation
    async addPostToBoard(_, { boardId, postId }, ctx) {
      await isAuthenticated(ctx);
      const currentUserId = ctx.req.payload.userId;
      try {
        // Checking if board doesn't exist
        const boardFound = await Board.findById(boardId);
        if (!boardFound) {
          throw new UserInputError("Board not found!");
        }

        const post = await postLoader.load(postId);

        if (!post) {
          throw new UserInputError("Post not found!");
        }

        return await Board.findByIdAndUpdate(
          boardId,
          {
            $addToSet: { posts: postId },
          },
          { new: true }
        );
      } catch (error) {
        throw new Error("Something went wrong");
      }
    },
  },
};

export default boardResolver;
