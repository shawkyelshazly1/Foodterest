import { useQuery } from "@apollo/client";
import React from "react";
import Masonry from "react-masonry-css";
import { GET_USER_POSTS } from "../graphql/posts";
import PostCard from "./PostCard";
import LoadingComponent from "./reusable/LoadingComponent";

export default function CreatedPostsComponent({ username }) {
	const breakpointColumnsObj = {
		default: 5,
		1700: 4,
		1100: 3,
		700: 2,
		500: 1,
	};

	// Lazy query to load user posts after profile loaded
	const { data: posts, loading: loadingPosts } = useQuery(GET_USER_POSTS, {
		variables: { username },
		fetchPolicy: "cache-and-network",
	});

	if (loadingPosts || !posts)
		return (
			<div className="w-full flex items-center justify-center">
				<LoadingComponent />
			</div>
		);

	return (
		<Masonry
			breakpointCols={breakpointColumnsObj}
			className="flex masonry-grid-style"
			columnClassName="masonry-grid_column-style"
		>
			{posts.getUserPosts.map((post) => (
				<PostCard
					key={post.id}
					post={post}
					// handleEditModal={handleEditModal}
				/>
			))}
		</Masonry>
	);
}
