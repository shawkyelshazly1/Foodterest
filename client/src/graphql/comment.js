const { gql } = require("@apollo/client");

exports.ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $content: String!) {
    addComment(postId: $postId, content: $content) {
      id
      content
      author {
        id
        avatar
        firstName
        lastName
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
