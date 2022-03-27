const { gql } = require("@apollo/client");

exports.ADD_POST_TO_BOARD = gql`
  mutation AddPostToBoard($boardId: ID!, $postId: ID!) {
    addPostToBoard(boardId: $boardId, postId: $postId) {
      id
      title
      posts {
        id
      }
    }
  }
`;

exports.GET_USER_BOARDS = gql`
  query GetUserBoards($userId: ID!) {
    getUserBoards(userId: $userId) {
      id
      title
      postsCount
    }
  }
`;

exports.GET_BOARD = gql`
  query GetBoard($boardId: ID!) {
    getBoard(boardId: $boardId) {
      id
      postsCount
      title
      author {
        id
        avatar
        firstName
        lastName
        username
      }
      posts {
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
  }
`;

exports.CREATE_BOARD = gql`
  mutation CreateBoard($title: String!, $privacy: String!) {
    createBoard(title: $title, privacy: $privacy) {
      id
      title
      postsCount
    }
  }
`;
