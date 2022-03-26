import validation from "./schemaValidation.js";
import { UserInputError } from "apollo-server-express";

// Validate register input agains JOI register Schema
export async function validateRegisterInput(fields) {
  // Validate the register input against the Joi schema
  try {
    const value = await validation.registerSchema.validateAsync(fields);
  } catch (error) {
    throw new UserInputError(error.details[0].message);
  }
}
// Validate login input agains JOI login Schema
export async function validateLoginInput(fields) {
  // Validate input agains Joi Schema
  try {
    const value = await validation.loginSchema.validateAsync(fields);
  } catch (error) {
    throw new UserInputError(error.details[0].message);
  }
}

// Validate post input agains JOI post Schema
export async function validatePostInput(fields) {
  // Validate input agains Joi Schema
  try {
    const value = await validation.postSchema.validateAsync(fields);
  } catch (error) {
    throw new UserInputError(error.details[0].message);
  }
}

// Validate comment input agains JOI comment Schema
export async function validateCommentInput(fields) {
  // Validate input agains Joi Schema
  try {
    const value = await validation.commentSchema.validateAsync(fields);
  } catch (error) {
    throw new UserInputError(error.details[0].message);
  }
}

// Validate comment input agains JOI comment Schema
export async function validateBoardInput(fields) {
  // Validate input agains Joi Schema
  try {
    const value = await validation.boardSchma.validateAsync(fields);
  } catch (error) {
    throw new UserInputError(error.details[0].message);
  }
}
