import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { GET_POST } from "../graphql/posts";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../components/reusable/LoadingComponent";
import { capitalize } from "underscore.string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import CommentsComponent from "../components/CommentsComponent";

export default function PostPage() {
  // Getting params for postId as well as setting the state to control the iamge style
  const { postId } = useParams();
  const [isLargeImage, setIsLargeImage] = useState(false);
  const navigate = useNavigate();

  // Loading post query
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { postId },
    onError(error) {
      navigate("/404");
    },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    // Getting Image height to determine style on DOM
  }, [postId]);

  if (loading)
    return (
      <div className="my-auto text-center">
        <LoadingComponent />
        <h1 className="text-2xl font-semibold text-gray-400 ">Loading...</h1>
      </div>
    );

  const handleImageStyle = () => {
    const renderedHeight = document.getElementById("image").clientHeight;
    if (renderedHeight > 500) {
      setIsLargeImage(true);
    } else {
      setIsLargeImage(false);
    }
  };

  return (
    <div className="bg-[#E9E9EB] w-full h-full flex justify-center items-start mt-5 max-h-fit">
      <div className=" bg-white w-3/5 min-h-[500px] max-h-fit flex flex-row justify-between gap-4 rounded-3xl mt-5">
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

        <div className="w-full h-full min-h-fit max-h-fit py-5 px-6 flex flex-col mt-16 gap-8 pr-6 ">
          <h1 className="text-5xl font-extrabold  break-all">
            {capitalize(data.getPost.title)}
          </h1>
          <div className="flex flex-row gap-5">
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
              {/* TODO: UPDATE FOLLOWERS HERE */}
              <span className="m-0 p-0">1.5k followers</span>
            </div>
            <button className="ml-auto text-lg text-black font-semibold  bg-[#E9E9EB] rounded-full py-3 px-7 hover:text-white hover:bg-slate-500">
              Follow
            </button>
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
