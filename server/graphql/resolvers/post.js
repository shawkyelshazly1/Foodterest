import Post from "../../models/post.js";
import { isAuthenticated } from "../../middlewares/auth.js";
import cloudinaryAPI from "../../utils/cloudinaryAPI.js";
import consola from "consola";
import { UserInputError, AuthenticationError } from "apollo-server-express";
import PostLike from "../../models/postLike.js";
import { validatePostInput } from "../../utils/validation.js";

const postResolver = {
  Query: {
    // Getting single post resolver by ID
    async getPost(_, { postId }, ctx) {
      await isAuthenticated(ctx);
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError("Post not Found");
        }
        return post;
      } catch (error) {
        consola.error(error);
        throw new Error("Something Went Wrong");
      }
    },
    // Getting posts resolver
    async getPosts(_, __, ctx) {
      await isAuthenticated(ctx);
      try {
        const posts = await Post.find({});
        return posts;
      } catch (error) {
        consola.error(error);
        throw new Error("Something Went Wrong");
      }
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
      console.log(userId);
      console.log(postFound.authorId.toString());
      if (postFound.authorId.toString() !== userId) {
        throw new AuthenticationError("Not Authorized.");
      }

      const result = await postFound.remove();

      return result;
    },

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
  },
};

export default postResolver;
