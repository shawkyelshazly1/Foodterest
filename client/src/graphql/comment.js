const { gql } = require("@apollo/client");

exports.ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $content: String!) {
    addComment(postId: $postId, content: $content) {
      id
      title
      image
      liked
      likesCount
      commentsCount
      comments {
        id
        content
        author {
          id
          firstName
          lastName
          avatar
          username
        }
      }
      author {
        id
        firstName
        lastName
        avatar
        username
      }
    }
  }
`;

exports.GET_POST_COMMENTS = gql`
  query GetPostComments($postId: ID!) {
    getPostComments(postId: $postId) {
      id
      content
      postId
      author {
        id
        firstName
        lastName
        avatar
        username
      }
    }
  }
`;

exports.DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId) {
      id
    }
  }
`;
