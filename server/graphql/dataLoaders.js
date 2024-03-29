import DataLoader from "dataloader";
import User from "../models/user.js";
import Post from "../models/post.js";
import Comment from "../models/comment.js";
import PostLike from "../models/postLike.js";
import Board from "../models/board.js";
import _ from "lodash";
import mongoose from "mongoose";

// User loader
export const userLoader = new DataLoader((usersIds) => {
  return User.find({ _id: { $in: usersIds } });
});

// Public Boards Loader
export const publicBoardLoader = new DataLoader(async (userIds) => {
  const results = await Board.find({
    $and: [{ userId: { $in: userIds } }, { privacy: "public" }],
  });
  return userIds.map((key) => _.find(results, { userId: key }));
});

// All Boards Loader
export const boardLoader = new DataLoader(async (userIds) => {
  let results = [];
  results.push(
    Board.find({
      userId: { $in: userIds },
    })
  );
  return results;
});

// Post Loader
export const postLoader = new DataLoader((postsIds) => {
  return Post.find({ _id: { $in: postsIds } });
});

// Comments Loader
export const commentLoader = new DataLoader((postsIds) => {
  return Comment.find({ postId: { $in: postsIds } });
});

// Comments count Loader
export const commentsCountLoader = new DataLoader(async (postsIds) => {
  const results = postsIds.map(async (id) => {
    const found = await Comment.find({ postId: id }, { postId: 1, _id: 0 });
    return found.length;
  });
  return results;
});

// PostLikes count Loader
export const postLikeLoader = new DataLoader(async (postsIds) => {
  const results = postsIds.map(async (id) => {
    const found = await PostLike.find({ postId: id }, { postId: 1, _id: 0 });
    return found.length;
  });

  return results;
});

// Post liked loader
export const loadLiked = async (postsIds, { payload }) => {
  const currentUserId = payload.userId;
  const results = postsIds.map(async (id) => {
    const found = await PostLike.find(
      // $and: [{ postId: parent._id }, { authorId: req.payload.userId }]
      { $and: [{ postId: id }, { authorId: currentUserId }] },
      { postId: 1, _id: 0 }
    );

    if (found.length !== 0) {
      return true;
    } else {
      return false;
    }
  });

  return results;
};
