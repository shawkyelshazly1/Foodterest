import React from "react";
import PostCard from "../components/PostCard";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../graphql/posts";
import LoadingComponent from "../components/reusable/LoadingComponent";

export default function Main() {
  const { data, loading, error } = useQuery(GET_POSTS);

  if (loading) {
    return <LoadingComponent />;
  }

  if (!loading && !data)
    return (
      <div className="customContainer  px-10 pt-2 pb-4">
        Sorry Nothing to see here!
      </div>
    );

  return (
    <div className="gridlist">
      {data.getPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
