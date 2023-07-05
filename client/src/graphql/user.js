const { gql } = require("@apollo/client");

// Register user mutation
const REGISTER_USER = gql`
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
const LOGIN_USER = gql`
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

const CURRENT_USER = gql`
	query CurrentUser {
		currentUser {
			id
			firstName
			lastName
			email
			username
			avatar
			boards {
				title
				id
				postsCount
			}
		}
	}
`;

const LOGOUT_USER = gql`
	mutation LogoutUser {
		logout
	}
`;

const LOAD_USER_PROFILE = gql`
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

const FOLLOW_AND_UNFOLLOW_USER = gql`
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

export {
	CURRENT_USER,
	FOLLOW_AND_UNFOLLOW_USER,
	LOAD_USER_PROFILE,
	LOGIN_USER,
	LOGOUT_USER,
	REGISTER_USER,
};
