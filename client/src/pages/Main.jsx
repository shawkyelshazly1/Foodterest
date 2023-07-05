import React, { useState } from "react";
import PostCard from "../components/PostCard";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../graphql/posts";
import LoadingComponent from "../components/reusable/LoadingComponent";
import Masonry from "react-masonry-css";
import EditPost from "../components/EditPost";
import BlankPageComponent from "../components/reusable/BlankPageComponent";

export default function Main() {
  const [postToEdit, setPostToEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEditModal = (post) => {
    if (post) {
      setShowModal(true);
      setPostToEdit(post);
      document.body.style.position = "relative";
    } else {
      setShowModal(false);
      setPostToEdit(null);
      document.body.style.position = "static";
    }
  };

  const { data, loading } = useQuery(GET_POSTS);

  if (loading) {
    return <LoadingComponent />;
  }

  if (!loading && data.getPosts.length === 0)
    return (
      <div className=" w-[30%] height-[30%] ">
        <BlankPageComponent />
      </div>
    );

  const breakpointColumnsObj = {
    default: 6,
    1700: 5,
    1100: 4,
    700: 3,
    500: 2,
    300: 1,
  };
  return (
    <div className="relative">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex masonry-grid-style mt-1"
        columnClassName="masonry-grid_column-style"
      >
        {data.getPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            handleEditModal={handleEditModal}
          />
        ))}
      </Masonry>
      <EditPost
        showModal={showModal}
        postToEdit={postToEdit}
        handleEditModal={handleEditModal}
      />
    </div>
  );
}
