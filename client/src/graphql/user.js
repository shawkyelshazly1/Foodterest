const { gql } = require("@apollo/client");

// exports.CURRENT_USER = gql``;

// Register user mutation
exports.REGISTER_USER = gql`
  mutation RegisterUser(
    $firstName: String!
    $lastName: String!
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      firstName: $firstName
      lastName: $lastName
      email: $email
      username: $username
      password: $password
      confirmPassword: $confirmPassword
    )
  }
`;

// Login user mutation
exports.LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        id
        firstName
        lastName
        email
        username
        avatar
      }
    }
  }
`;

exports.CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      id
      firstName
      lastName
      email
      username
      avatar
    }
  }
`;

exports.LOGOUT_USER = gql`
  mutation LogoutUser {
    logout
  }
`;

exports.LOAD_USER_PROFILE = gql`
  query GetUserProfile($username: String!) {
    getUserProfile(username: $username) {
      id
      firstName
      lastName
      username
      email
      avatar
      followed
      followersCount
      followingsCount
    }
  }
`;

exports.FOLLOW_AND_UNFOLLOW_USER = gql`
  mutation FollowOrUnfollowUser($username: String!) {
    followUser(username: $username) {
      id
      firstName
      lastName
      username
      email
      avatar
      followed
      followersCount
      followingsCount
    }
  }
`;
