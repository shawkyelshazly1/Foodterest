import Post from "../../models/post.js";
import { isAuthenticated } from "../../middlewares/auth.js";
import cloudinaryAPI from "../../utils/cloudinaryAPI.js";
import consola from "consola";
import { UserInputError, AuthenticationError } from "apollo-server-express";
import PostLike from "../../models/postLike.js";
import { validatePostInput } from "../../utils/validation.js";
import User from "../../models/user.js";
import Following from "../../models/following.js";
import { postLoader, postLikeLoader } from "../dataLoaders.js";
import _s from "underscore.string";
const postResolver = {
  Query: {
    // Getting single post resolver by ID
    async getPost(_, { postId }, ctx) {
      await isAuthenticated(ctx);
      try {
        const post = await postLoader.load(postId.toString());
        // const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError("Post not Found");
        }
        return post;
      } catch (error) {
        consola.error(error);
        throw new Error("Something Went Wrong");
      }
    },
    // Getting posts based on followers resolver
    async getPosts(_, __, ctx) {
      await isAuthenticated(ctx);
      const currentUserId = ctx.req.payload.userId;

      try {
        let followingsList = [];
        const followings = await Following.find(
          { user: currentUserId },
          { target: 1, _id: 0 }
        );
        followings.forEach((doc) => {
          followingsList.push(doc.target);
        });

        followingsList.push(currentUserId);

        const posts = await Post.find({
          authorId: { $in: followingsList },
        }).sort({
          createdAt: 1,
        });

        return posts;
      } catch (error) {
        consola.error(error);
        throw new Error("Something Went Wrong");
      }
    },

    // Get user posts query
    async getUserPosts(_, { username }, ctx) {
      await isAuthenticated(ctx);
      let user = "";
      try {
        user = await User.findOne({ username });

        if (!user) {
          throw new UserInputError("User not found!");
        }
      } catch (error) {
        consola.error(error);
        throw new AuthenticationError("Not Authenticated");
      }

      const posts = await Post.find({ authorId: user.id });
      return posts;
    },
  },
  Mutation: {
    // Creating post mutation
    async createPost(_, { image, title }, ctx) {
      await isAuthenticated(ctx);
      const userId = ctx.req.payload.userId;

      await validatePostInput({ title });

      let imageURL = "";

      try {
        const cloudinaryRes = await cloudinaryAPI.uploader.upload(image, {
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        });
        imageURL = cloudinaryRes.secure_url;
      } catch (error) {
        consola.error(error);
        throw new Error("Something went wrong uploading the image!");
      }

      console.log(_s.strLeft(imageURL, "/upload/"));
      console.log(_s.strRight(imageURL, "/upload/"));
      imageURL = `${_s.strLeft(
        imageURL,
        "/upload/"
      )}/upload/q_auto,f_auto/${_s.strRight(imageURL, "/upload/")}`;

      const newPost = await new Post({
        image: imageURL,
        title,
        authorId: userId,
      });

      await newPost.save();

      return newPost;
    },

    //Deleting Post Mutation
    async deletePost(_, { postId }, ctx) {
      await isAuthenticated(ctx);
      const userId = ctx.req.payload.userId;
      let postFound = "";
      try {
        postFound = await Post.findById(postId);
      } catch (error) {
        consola.error(error);
        throw new Error("Something Went Wrong");
      }

      if (!postFound) {
        throw new UserInputError("Post not Found");
      }
      if (postFound.authorId.toString() !== userId) {
        throw new AuthenticationError("Not Authorized.");
      }

      const result = await postFound.remove();

      return result;
    },

    // LIke post mutation
    async likePost(_, { postId }, ctx) {
      await isAuthenticated(ctx);
      const userId = ctx.req.payload.userId;

      let post = "";
      try {
        post = await Post.findById(postId);
      } catch (error) {
        consola.error(error);
        throw new Error("Something Went Wrong");
      }

      if (!post) {
        throw new UserInputError("Post not Found");
      }

      postLikeLoader.clear(postId.toString());

      try {
        const likeFound = await PostLike.findOne({
          $and: [{ postId }, { authorId: userId }],
        });

        if (likeFound) {
          await likeFound.remove();

          return post;
        } else {
          const newLike = await new PostLike({
            postId,
            authorId: userId,
          });

          await newLike.save();
          return post;
        }
      } catch (error) {
        consola.error(error);
        throw new Error("Something Went Wrong");
      }
    },

    // Update Post Mutation
    async updatePost(_, { postId, title }, ctx) {
      await isAuthenticated(ctx);
      const userId = ctx.req.payload.userId;

      let post = "";
      try {
        post = await Post.findById(postId);
      } catch (error) {
        consola.error(error);
        throw new Error("Something Went Wrong");
      }

      if (!post) {
        throw new UserInputError("Post not Found");
      }

      if (post.authorId.toString() !== userId) {
        throw new AuthenticationError("Not Authorized.");
      }

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title },
        { new: true }
      );
      return updatedPost;
    },
  },
};

export default postResolver;
