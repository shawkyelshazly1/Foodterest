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
      commentsCount
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
      likesCount
      commentsCount
      liked
      author {
        id
        avatar
        firstName
        username
        lastName
      }
    }
  }
`;
