import React, { useState } from "react";
import { Cache, useMutation, useQuery } from "@apollo/client";
import { CURRENT_USER } from "../graphql/user";
import { capitalize } from "underscore.string";
import FileUpload from "../components/FileUpload";
import { CREATE_POST, GET_POSTS } from "../graphql/posts";
import FormErrors from "../components/reusable/FormErrors";
import LoadingComponent from "../components/reusable/LoadingComponent";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  // Loading current use from cached data
  const {
    data: { currentUser },
  } = useQuery(CURRENT_USER, {
    fetchPolicy: "cache-only",
  });

  // create post mutation
  const [createPost, { loading, data, error }] = useMutation(CREATE_POST, {
    onError(error) {
      setErrors(error.graphQLErrors);
    },

    onCompleted(data) {
      if (data.createPost.id) {
        navigate(`/posts/${data.createPost.id}`);
      }
    },
  });

  // Handle file upload
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (image) {
      setErrors(null);
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        createPost({
          variables: {
            title: title,
            image: reader.result,
          },
          refetchQueries: [{ query: GET_POSTS }],
        });
      };
    } else {
      setErrors([{ message: "Please select a photo", path: [1] }]);
    }
  };

  return (
    <div className="bg-[#E9E9EB] w-full h-full flex justify-center items-center">
      <form
        className="w-full h-full flex justify-center items-center"
        onSubmit={(e) => handleFormSubmit(e)}
      >
        <div className="rounded-2xl w-2/4  bg-white flex flex-col  gap- p-5  py-7 min-h-[600px]">
          {!loading ? (
            <>
              <button className=" py-2 px-4 bg-red-500 rounded-full text-white text-lg font-semibold  self-end">
                Save
              </button>
              <div className="flex flex-row justify-center gap-9 h-full flex-1">
                <div className="w-full  text-center">
                  <FileUpload setImage={setImage} />
                </div>
                <div className="flex mx-auto w-full flex-col gap-6 items-start content-start h-full mt-5">
                  <input
                    min={1}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    required
                    type="text"
                    placeholder="Add your title"
                    className=" font-semibold text-3xl border-b-2 p-2 focus:outline-none focus:border-b-blue-400"
                  />
                  <div className="flex flex-row items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt=""
                      className="rounded-full w-12 h-12"
                    />
                    <h1 className="font-semibold text-lg">
                      {capitalize(currentUser.firstName)}{" "}
                      {capitalize(currentUser.lastName)}
                    </h1>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="my-auto text-center">
              <LoadingComponent />
              <h1 className="text-2xl font-semibold text-gray-400 ">
                Sending Your Idea...
              </h1>
            </div>
          )}

          {errors ? <FormErrors errors={errors} /> : null}
        </div>
      </form>
    </div>
  );
}
