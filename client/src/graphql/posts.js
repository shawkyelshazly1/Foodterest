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
