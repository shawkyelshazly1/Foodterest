import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import {
  DELETE_POST,
  GET_POST,
  GET_USER_POSTS,
  LIKE_POST,
} from "../graphql/posts";
import { Link, useNavigate } from "react-router-dom";
import LoadingComponent from "../components/reusable/LoadingComponent";
import { capitalize } from "underscore.string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import CommentsComponent from "../components/CommentsComponent";
import numeral from "numeral";
import { CURRENT_USER, FOLLOW_AND_UNFOLLOW_USER } from "../graphql/user";
import HeartFilledComponent from "../components/reusable/HeartFilledComponent";
import HeartUnfilledComponent from "../components/reusable/HeartUnfilledComponent";

export default function PostPage() {
  // Getting params for postId as well as setting the state to control the iamge style
  const { postId } = useParams();
  const [isLargeImage, setIsLargeImage] = useState(false);
  const navigate = useNavigate();

  const ref = useRef();

  // Loading current use from cached data
  const {
    data: { currentUser },
  } = useQuery(CURRENT_USER, {
    fetchPolicy: "cache-only",
  });

  // Like & Unlike post mutation
  const [likePost] = useMutation(LIKE_POST, { variables: { postId } });

  // Follow & unfollow user Mutation
  const [
    followUser,
    { data: followData, loading: followLoading, error: followError },
  ] = useMutation(FOLLOW_AND_UNFOLLOW_USER);

  // Loading post query
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { postId },
    onError(error) {
      navigate("/404");
    },
  });

  // handle delete post mutation
  const [deletePost] = useMutation(DELETE_POST, {
    variables: { postId },
    onCompleted(data) {
      if (data.deletePost.id) {
        navigate("/");
      }
    },
  });

  // Use effect to handle clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        e.target.classList.contains("mainContainer")
      ) {
        navigate(-1);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [postId, navigate]);

  // Return loading component while loading query
  if (loading)
    return (
      <div className="my-auto text-center">
        <LoadingComponent />
        <h1 className="text-2xl font-semibold text-gray-400 ">Loading...</h1>
      </div>
    );

  // Handling image size to determine view style
  const handleImageStyle = () => {
    const renderedHeight = document.getElementById("image").clientHeight;
    if (renderedHeight > 500) {
      setIsLargeImage(true);
    } else {
      setIsLargeImage(false);
    }
  };

  return (
    <div className="bg-[#ececee] w-full h-full flex justify-center items-start  max-h-fit mainContainer">
      <button className="absolute left-5 top-14 hover:bg-[#dddddd] rounded-full py-2 px-3 flex items-center justify-center">
        <FontAwesomeIcon
          icon={faArrowLeft}
          size="2x"
          onClick={(e) => {
            navigate(-1);
          }}
        />
      </button>
      <div
        ref={ref}
        className=" bg-white w-3/5 min-h-[500px] max-h-fit  flex flex-row justify-between gap-4 rounded-3xl mt-[4rem] custom-shadow-2"
      >
        {isLargeImage ? (
          <div className="w-full h-full">
            <img
              onLoad={() => {
                handleImageStyle();
              }}
              id="image"
              className="rounded-tl-3xl rounded-bl-3xl"
              src={data.getPost.image}
              alt=""
            />
          </div>
        ) : (
          <div className="w-full h-full p-7">
            <img
              onLoad={() => {
                handleImageStyle();
              }}
              id="image"
              className="rounded-xl"
              src={data.getPost.image}
              alt=""
            />
          </div>
        )}

        <div className="w-full h-full min-h-fit max-h-fit py-5 px-6 flex flex-col gap-8 pr-6 pt-7">
          <div className="flex flex-row justify-between">
            {data.getPost.liked ? (
              <HeartFilledComponent
                size="2xl"
                cursor={"cursor-pointer"}
                onClick={() => {
                  likePost();
                }}
                animation="animate-heartGrow"
              />
            ) : (
              <HeartUnfilledComponent
                size="2xl"
                cursor={"cursor-pointer"}
                onClick={() => {
                  likePost();
                }}
              />
            )}
            {currentUser.id === data.getPost.author.id ? (
              <button
                onClick={(e) => deletePost()}
                className="ml-auto hover:bg-red-600 py-2 px-4 rounded-full bg-red-500 text-white font-semibold"
              >
                Delete
              </button>
            ) : null}
          </div>
          <h1 className="text-5xl font-extrabold  break-words">
            {capitalize(data.getPost.title)}
          </h1>
          <div className="flex flex-row gap-5">
            <Link
              to={`/profile/${data.getPost.author.username}`}
              className="flex flex-row gap-4"
            >
              <img
                src={data.getPost.author.avatar}
                alt=""
                className="h-12 w-12 rounded-full"
              />
              <div className="flex flex-col gap-0">
                <span className="font-bold text-lg ">
                  {capitalize(data.getPost.author.firstName)}{" "}
                  {capitalize(data.getPost.author.lastName)}
                </span>

                <span className="m-0 p-0">
                  {numeral(data.getPost.author.followersCount).format("0a")}{" "}
                  followers
                </span>
              </div>
            </Link>
            {data.getPost.author.id === currentUser.id ? (
              ""
            ) : (
              <button
                onClick={() => {
                  followUser({
                    variables: { username: data.getPost.author.username },
                  });
                }}
                className={` ml-auto rounded-full py-3 px-4 font-semibold ${
                  data.getPost.author.followed
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-800 hover:bg-gray-900"
                } text-white`}
              >
                {data.getPost.author.followed ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
          <h1 className="font-semibold text-xl flex flex-row gap-3 items-center">
            Comments <FontAwesomeIcon icon={faAngleDown} />
          </h1>
          <CommentsComponent
            comments={data.getPost.comments}
            postId={data.getPost.id}
          />
        </div>
      </div>
    </div>
  );
}
