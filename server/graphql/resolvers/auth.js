import User from "../../models/user.js";
import { UserInputError, AuthenticationError } from "apollo-server-express";
import { hash, compare } from "bcrypt";
import validation from "../../utils/schemaValidation.js";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../../utils/validation.js";
import {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
} from "../../utils/auth.js";

const authResolver = {
  Mutation: {
    // User login resolver
    async login(_, { email, password }, { res }) {
      // Validate input agains Joi Schema
      await validateLoginInput({ email, password });

      // looking for user in DB
      const user = await User.findOne({ email });

      // If user not found
      if (!user) {
        throw new UserInputError("Email not found!");
      }

      // Validate encrypted password
      const isValid = await compare(password, user.password);
      if (!isValid) {
        throw new UserInputError("Incorrect password!");
      }

      await sendRefreshToken(res, await generateRefreshToken(user));

      return {
        accessToken: await generateAccessToken(user),
        user,
      };
    },

    // User Register resolver
    async register(
      _,
      { firstName, lastName, username, email, password, confirmPassword }
    ) {
      // Validate the register input against the Joi schema
      await validateRegisterInput({
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword,
      });

      // checking if user exists already in DB or not

      const userFoundEmail = await User.findOne({ email });

      if (userFoundEmail) {
        throw new UserInputError("Email is taken!", {
          field: "email",
        });
      } else {
        const userFoundUsername = await User.findOne({ username });
        if (userFoundUsername) {
          throw new UserInputError(" Username is taken!", {
            field: "username",
          });
        }
      }

      // Hashing password and creating/saving new user in DB
      password = await hash(password, 12);

      const newUser = await new User({
        firstName,
        lastName,
        username,
        email,
        password,
      });

      await newUser.save();

      return true;
    },

    // User logout Mutation
    async logout(_, __, { req, res }) {
      sendRefreshToken(res, "");
      return true;
    },
  },
};

export default authResolver;
