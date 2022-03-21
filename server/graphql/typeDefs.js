import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    avatar: String!
  }

  type LoginResponse {
    accessToken: String!
    user: User!
  }

  type Query {
    hello: String!
  }

  type Mutation {
    login(email: String!, password: String!): LoginResponse!
    register(
      firstName: String!
      lastName: String!
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): Boolean!
  }
`;

export default typeDefs;
