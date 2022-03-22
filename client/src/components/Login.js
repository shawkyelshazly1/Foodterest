import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { CURRENT_USER, LOGIN_USER } from "../graphql/user";
import FormErrors from "./reusable/FormErrors";
import LoadingComponent from "./reusable/LoadingComponent";
import { setAccessToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  // useNavigate API
  const navigate = useNavigate();

  // formData state holder
  const [formData, setFormData] = useState({ email: "", password: "" });
  // Setting form satate errors to show in the form errors component
  const [errors, setErrors] = useState(null);

  // GraphQL Mutation to login user
  const [loginUser, { loading, data }] = useMutation(LOGIN_USER, {
    onError(error) {
      setErrors(error.graphQLErrors);
    },
    onCompleted(data) {
      if (data && data.accessToken !== "") {
        setErrors(null);
        setAccessToken(data.login.accessToken);
      }
    },
    update(cache, { data }) {
      if (!data) {
        return null;
      }
      cache.writeQuery({
        query: CURRENT_USER,
        data: { currentUser: data.login.user },
      });
      navigate("/");
    },
  });

  // Handle inputs value change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submmission
  const handleFormSubmission = (e) => {
    e.preventDefault();
    loginUser({ variables: { ...formData } });
  };

  // Showing loading component only if loading & no data so would disappear with errors after loading
  if (loading && data === undefined) {
    return (
      <>
        <LoadingComponent />
      </>
    );
  }

  return (
    <>
      <form
        onSubmit={(e) => handleFormSubmission(e)}
        className="flex flex-col gap-2 pt-4 w-3/5"
      >
        <input
          required
          value={formData.email}
          onChange={(e) => handleInputChange(e)}
          name="email"
          className="border-2 border-gray-300 p-2 px-3 border-solid text-lg rounded-xl  focus:outline-gray-500 focus:outline-4"
          type="email"
          placeholder="Email"
        />
        <input
          required
          value={formData.password}
          onChange={(e) => handleInputChange(e)}
          name="password"
          className="border-2 border-gray-300 p-2 px-3 border-solid text-lg rounded-xl focus:outline-gray-500 focus:outline-4"
          type="password"
          placeholder="Password"
        />
        <p className="relative float-left ml-3  text-md cursor-pointer font-semibold text-gray-500">
          Forgot your password?
        </p>
        <button
          type="submit"
          className="bg-slate-400 py-2 text-lg mt-3  rounded-full text-white font-semibold"
        >
          Log in
        </button>
      </form>
      {errors ? <FormErrors errors={errors} /> : null}
    </>
  );
}
