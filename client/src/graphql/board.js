const { gql } = require("@apollo/client");

const ADD_POST_TO_BOARD = gql`
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

const GET_USER_BOARDS = gql`
	query GetUserBoards($userId: ID!) {
		getUserBoards(userId: $userId) {
			id
			title
			postsCount
		}
	}
`;

const GET_BOARD = gql`
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

const CREATE_BOARD = gql`
	mutation CreateBoard($title: String!, $privacy: String!) {
		createBoard(title: $title, privacy: $privacy) {
			id
			title
			postsCount
		}
	}
`;

export { CREATE_BOARD, ADD_POST_TO_BOARD, GET_BOARD, GET_USER_BOARDS };
