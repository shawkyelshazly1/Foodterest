const { gql } = require("@apollo/client");

exports.GET_POSTS = gql`
  query GetPosts {
    getPosts {
      title
      id
      image
      liked
      likesCount
      commentsCount
      author {
        id
        username
        avatar
      }
    }
  }
`;

exports.LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      liked
      likesCount
    }
  }
`;

exports.CREATE_POST = gql`
  mutation CreatePost($image: String!, $title: String!) {
    createPost(image: $image, title: $title) {
      title
      id
      image
      liked
      likesCount
      commentsCount
      author {
        id
        username
        avatar
      }
    }
  }
`;

exports.GET_POST = gql`
  query GetPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      title
      image
      author {
        id
        avatar
        firstName
        username
        lastName
        followed
        followersCount
      }
    }
  }
`;

exports.UPDATE_POST = gql`
  mutation UpdatePost($postId: ID!, $title: String!) {
    updatePost(postId: $postId, title: $title) {
      id
      title
    }
  }
`;

exports.GET_USER_POSTS = gql`
  query GetUserPosts($username: String!) {
    getUserPosts(username: $username) {
      id
      title
      image
      likesCount
      commentsCount
      liked
      author {
        username
        firstName
        avatar
        lastName
        id
      }
    }
  }
`;
