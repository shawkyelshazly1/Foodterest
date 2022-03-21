import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    avatar: String!
    posts: [Post!]
  }

  type LoginResponse {
    accessToken: String!
    user: User!
  }

  type Post {
    id: ID!
    image: String!
    title: String!
    author: User!
    likesCount: Int!
    commentsCount: Int!
    liked: Boolean!
    comments: [Comment!]
  }

  type Comment {
    id: ID!
    content: String!
    author: User!
  }

  type Query {
    hello: String!
    getPost(postId: ID!): Post!
    getPosts: [Post!]
  }

  type Mutation {
    # User Mutations
    login(email: String!, password: String!): LoginResponse!
    register(
      firstName: String!
      lastName: String!
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): Boolean!

    # Post Mutations
    createPost(image: String!, title: String!): Post!
    deletePost(postId: ID!): Post!

    #(like & dislike)Mutation
    likePost(postId: ID!): Post!

    #Comment Mutation
    addComment(postId: ID!, content: String!): Comment!
    deleteComment(commentId: ID!): Comment!
  }
`;

export default typeDefs;
