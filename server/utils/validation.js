import validation from "./schemaValidation.js";
import { UserInputError } from "apollo-server-express";

export async function validateRegisterInput(fields) {
  // Validate the register input against the Joi schema
  try {
    const value = await validation.registerSchema.validateAsync(fields);
  } catch (error) {
    throw new UserInputError(error.details[0].message);
  }
}
export async function validateLoginInput(fields) {
  // Validate input agains Joi Schema
  try {
    const value = await validation.loginSchema.validateAsync(fields);
  } catch (error) {
    throw new UserInputError(error.details[0].message);
  }
}
