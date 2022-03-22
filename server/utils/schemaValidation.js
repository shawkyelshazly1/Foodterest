import Joi from "joi";

// Defining Register validation Schema

const validationSchemas = {
  registerSchema: Joi.object({
    firstName: Joi.string()
      .alphanum()
      .required()
      .max(25)
      .min(3)
      .message("FirstName must be an alphbet and between 3 & 25."),
    lastName: Joi.string()
      .alphanum()
      .required()
      .max(25)
      .min(3)
      .message("Last Name must be an alphbet and between 3 & 25."),
    username: Joi.string()
      .alphanum()
      .required()
      .max(25)
      .min(3)
      .message("Username must be an alphbet and between 3 & 25."),
    email: Joi.string().email().message("Use a valid email"),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
      .message(
        "Password must be between 6 & 30. and should contain numbers & letters"
      ),
    confirmPassword: Joi.ref("password"),
  }).with("password", "confirmPassword"),

  loginSchema: Joi.object({
    email: Joi.string()
      .required()
      .email()
      .message("Please enter a valid email."),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
      .message(
        "Password must be between 6 & 30. and shou;d contain numbers & letters"
      ),
  }),

  postSchema: Joi.object({
    title: Joi.string()
      .required()

      .min(5)
      .max(40)
      .message("Title shouldn't be empty, and should be within 5 & 40 chars."),
  }),

  commentSchema: Joi.object({
    content: Joi.string()
      .required()
      .min(1)
      .max(40)
      .message(
        "Comment shouldn't be empty, and should be within 1 & 40 chars."
      ),
  }),
};

export default validationSchemas;
