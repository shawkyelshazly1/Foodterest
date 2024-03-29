import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    avatar: String!
    email: String!
    posts: [Post!]
    followersCount: Int!
    followingsCount: Int!
    followed: Boolean!
    boards: [Board!]
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
    postId: ID!
  }

  type Board {
    id: ID!
    title: String!
    author: User!
    posts: [Post!]
    privacy: String!
    postsCount: Int!
  }

  type Query {
    hello: String!
    getPost(postId: ID!): Post!
    getPosts: [Post!]
    currentUser: User!
    getPostComments(postId: ID!): [Comment!]
    getUserProfile(username: String!): User!
    getUserPosts(username: String!): [Post!]
    getUserBoards(userId: ID!): [Board!]
    getBoard(boardId: ID!): Board!
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
    logout: Boolean!
    followUser(username: String!): [User!]

    # Post Mutations
    createPost(image: String!, title: String!): Post!
    deletePost(postId: ID!): Post!
    updatePost(postId: ID!, title: String!): Post!

    #(like & dislike)Mutation
    likePost(postId: ID!): Post!

    #Comment Mutation
    addComment(postId: ID!, content: String!): Post!
    deleteComment(commentId: ID!): Post!

    #Board mutation
    createBoard(title: String!, privacy: String!): Board!
    addPostToBoard(boardId: ID!, postId: ID!): Board!
  }
`;

export default typeDefs;
