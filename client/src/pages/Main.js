import React from "react";
import PostCard from "../components/PostCard";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../graphql/posts";
import LoadingComponent from "../components/reusable/LoadingComponent";

export default function Main() {
  const { data, loading } = useQuery(GET_POSTS);

  if (loading) {
    return <LoadingComponent />;
  }

  if (!loading && data.getPosts.length === 0)
    return (
      <div className="customContainer  px-10 pt-2 pb-4">
        <h1 className="text-4xl font-semibold text-gray-400">
          Sorry Nothing to see here!
        </h1>
      </div>
    );
  console.log(data);
  return (
    <div className="gridlist">
      {data.getPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
