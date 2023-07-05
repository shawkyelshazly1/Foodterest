import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faTrash } from "@fortawesome/free-solid-svg-icons";
import HeartFilledComponent from "./reusable/HeartFilledComponent";
import HeartUnfilledComponent from "./reusable/HeartUnfilledComponent";
import { CURRENT_USER } from "../graphql/user";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_COMMENT, GET_POST_COMMENTS } from "../graphql/comment";

export default function CommentComponent({ comment }) {
	const [showDropDown, setShowDropDown] = useState(false);
	const ref = useRef(null);

	// Loading current use from cached data
	const {
		data: { currentUser },
	} = useQuery(CURRENT_USER, {
		fetchPolicy: "cache-only",
	});

	// Mutation to delete comment
	const [deletComment, { data, loading, error, client }] = useMutation(
		DELETE_COMMENT,
		{
			onCompleted(data) {
				if (data.deleteComment.comments.length > 0) {
					const updatedComments = data.deleteComment.comments;
					client.cache.updateQuery(
						{
							query: GET_POST_COMMENTS,
							variables: { postId: comment.postId },
						},
						(data) => ({
							getPostComments: [...updatedComments],
						})
					);
				} else {
					client.cache.updateQuery(
						{
							query: GET_POST_COMMENTS,
							variables: { postId: comment.postId },
						},
						(data) => ({
							getPostComments: [],
						})
					);
				}
			},
		}
	);

	// Useeffect to register clicking outside the ref for the dropdown menu
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (ref.current && !ref.current.contains(e.target)) {
				if (showDropDown) {
					setShowDropDown(false);
				}
			}
		};

		document.addEventListener("click", handleClickOutside, true);
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [showDropDown]);

	return (
		<div className="flex flex-row gap-3 h-full ">
			<img
				src={comment.author.avatar}
				alt=""
				className="w-12 h-12 rounded-full"
			/>
			<div className="w-full h-full flex flex-col gap-1">
				<h1 className="flex-1 rounded-2xl py-2 border-2 outline-slate-600 px-4">
					{comment.content}
				</h1>
				<div className="flex flex-row gap-1 ml-5 w-fit">
					{/* TODO: ADD like comment functionality here */}

					<HeartUnfilledComponent size="lg" />
					<div className="relative w-full" ref={ref}>
						<FontAwesomeIcon
							icon={faEllipsis}
							size="lg"
							className="cursor-pointer"
							onClick={() => {
								if (showDropDown) {
									setShowDropDown(false);
								} else {
									setShowDropDown(true);
								}
							}}
						/>
						<div
							className={`${
								showDropDown ? "" : "hidden"
							} font-semibold custom-shadow rounded-lg min-w-[120px] p-2 flex flex-col items-center  gap-2  absolute z-40 top-5 left-[-5px] bg-white `}
						>
							{currentUser.id === comment.author.id ? (
								<div
									className="cursor-pointer hover:bg-gray-200 w-full py-1 flex flex-row gap-1 items-center justify-center  rounded-lg"
									onClick={() => {
										deletComment({ variables: { commentId: comment.id } });
									}}
								>
									Delete
									<FontAwesomeIcon size="lg" icon={faTrash} color="gray" />
								</div>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
