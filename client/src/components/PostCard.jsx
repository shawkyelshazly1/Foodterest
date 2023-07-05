import React, { useState } from "react";
import { Link } from "react-router-dom";
import { capitalize, prune } from "underscore.string";
import HeartFilledComponent from "./reusable/HeartFilledComponent";
import CommentFilledComponent from "./reusable/CommentFilledComponent";
import { useQuery } from "@apollo/client";

import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { CURRENT_USER } from "../graphql/user";
import SaveToBoard from "./SaveToBoard";

export default function PostCard({ post, handleEditModal }) {
	const [showOverlay, setShowOverlay] = useState("hidden");
	const [showBoardsMenu, setShowBoardsMenu] = useState(false);
	const [savedToBoard, setSavedToBoard] = useState(false);
	const navigate = useNavigate();

	// Loading current use from cached data
	const {
		data: { currentUser },
	} = useQuery(CURRENT_USER, {
		fetchPolicy: "cache-only",
	});

	// Handle opening the edit modal
	const openEditModal = (e) => {
		e.preventDefault();
		e.stopPropagation();
		handleEditModal(post);
	};

	// Handle navigating to the user profile
	const goUserProfile = (e) => {
		e.preventDefault();
		e.stopPropagation();
		navigate(`profile/${post.author.username}`);
	};

	// Handle Save to board
	const handleBoardsMenu = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (showBoardsMenu) {
			setShowBoardsMenu(false);
		} else {
			setShowBoardsMenu(true);
		}
	};

	return (
		<div className="flex flex-col my-6">
			<div
				onClick={() => {
					navigate(`/posts/${post.id}`);
				}}
				className=" rounded-2xl relative w-full "
				onMouseEnter={() => {
					setShowOverlay("");
				}}
				onMouseLeave={() => setShowOverlay("hidden")}
			>
				<img
					className="MediaCard rounded-2xl w-full bg-gray-50"
					src={post.image}
					alt=""
				/>
				<div
					className={` ${showOverlay} absolute w-full h-full rounded-2xl  z-20 bg-black opacity-30 top-0 left-0 flex flex-col p-3`}
				></div>
				<div
					className={` ${showOverlay} absolute w-full h-full  rounded-2xl z-30 top-0 left-0 flex flex-col p-3 pl-4  `}
				>
					<div className="flex flex-row pl-1 items-center justify-between px-2 w-full h-fit">
						<button
							onClick={(e) => handleBoardsMenu(e)}
							className={`ml-auto hover:bg-gray-600 ${
								savedToBoard ? "bg-gray-800" : ""
							} py-2 px-4 rounded-full bg-gray-500 text-white font-semibold`}
						>
							{savedToBoard ? "Saved" : "Save"}
						</button>
					</div>
					<div className="absolute bottom-3 flex flex-row items-center gap-2 justify-between w-full">
						{currentUser.id === post.author.id ? (
							<div
								className="ml-auto cursor-pointer mr-9"
								onClick={(e) => {
									openEditModal(e);
								}}
							>
								<FontAwesomeIcon
									icon={faPenToSquare}
									size="2x"
									color="white"
									className="z-40"
								/>
							</div>
						) : (
							<></>
						)}
					</div>
				</div>
				<SaveToBoard
					postId={post.id}
					showBoardsMenu={showBoardsMenu}
					setShowBoardsMenu={setShowBoardsMenu}
					setSavedToBoard={setSavedToBoard}
				/>
			</div>
			<div className="flex flex-row justify-between gap-1 w-full h-full">
				<div className="flex flex-col pl-2">
					<Link to={`/posts/${post.id}`} className="cursor-default  w-fit">
						<h1 className="  text-lg text-black font-semibold pt-2">
							{prune(capitalize(post.title), 30)}
						</h1>
					</Link>
					<div
						className=" flex flex-row items-center gap-2 cursor-pointer w-fit"
						onClick={(e) => {
							goUserProfile(e);
						}}
					>
						<img
							className="w-8 h-8  rounded-full"
							src={post.author.avatar}
							alt=""
						/>
						<h1 className="text-gray-500 text-sm font-thin ">
							{capitalize(post.author.firstName)}{" "}
							{capitalize(post.author.lastName)}
						</h1>
					</div>
				</div>
				<div className="flex flex-row items-start pt-2 pr-2 gap-1">
					<div className="flex f</div>lex-row items-center gap-1">
						<HeartFilledComponent size="1x" />
						<p className=" font-Roboto font-medium text-[1rem]">
							{post.likesCount}
						</p>
					</div>

					<div className="flex flex-row items-center gap-1">
						<CommentFilledComponent size="1x" />
						<p className="font-Roboto font-medium text-[1rem]">
							{post.commentsCount}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
