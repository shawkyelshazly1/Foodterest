const { gql } = require("@apollo/client");

const ADD_COMMENT = gql`
	mutation AddComment($postId: ID!, $content: String!) {
		addComment(postId: $postId, content: $content) {
			id
			commentsCount
			comments {
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
	}
`;

const GET_POST_COMMENTS = gql`
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

const DELETE_COMMENT = gql`
	mutation DeleteComment($commentId: ID!) {
		deleteComment(commentId: $commentId) {
			id
			commentsCount
			comments {
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
	}
`;

export { ADD_COMMENT, DELETE_COMMENT, GET_POST_COMMENTS };
