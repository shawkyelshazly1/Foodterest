const { gql } = require("@apollo/client");

const GET_POSTS = gql`
	query GetPosts {
		getPosts {
			title
			id
			image
			likesCount
			commentsCount
			author {
				id
				username
				firstName
				lastName
				avatar
			}
		}
	}
`;

const LIKE_POST = gql`
	mutation LikePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			liked
			likesCount
		}
	}
`;

const CREATE_POST = gql`
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

const GET_POST = gql`
	query GetPost($postId: ID!) {
		getPost(postId: $postId) {
			id
			title
			image
			liked
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

const UPDATE_POST = gql`
	mutation UpdatePost($postId: ID!, $title: String!) {
		updatePost(postId: $postId, title: $title) {
			id
			title
		}
	}
`;

const GET_USER_POSTS = gql`
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

const DELETE_POST = gql`
	mutation DeletePost($postId: ID!) {
		deletePost(postId: $postId) {
			id
		}
	}
`;

export {
	CREATE_POST,
	DELETE_POST,
	GET_POST,
	GET_POSTS,
	GET_USER_POSTS,
	LIKE_POST,
	UPDATE_POST,
};
