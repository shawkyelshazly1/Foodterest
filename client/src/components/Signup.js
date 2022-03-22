import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { REGISTER_USER } from "../graphql/user";
import FormErrors from "./reusable/FormErrors";
import LoadingComponent from "./reusable/LoadingComponent";

export default function Signup({ setComponent, setSuccessMessage }) {
  // Setting form satate errors to show in the form errors component
  const [errors, setErrors] = useState(null);

  // GraphQL Mutation to register user
  const [registerUser, { data, loading, error }] = useMutation(REGISTER_USER, {
    onError(error) {
      setErrors(error.graphQLErrors);
    },
    onCompleted(data) {
      if (data.register) {
        setComponent("login");
        setSuccessMessage(
          "Registered Successfully, Please Login & Enjoy The Journey!"
        );
      }
    },
  });

  // Form Data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // Function to get fields values
  const handleFieldChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submmission
  const handleFormSubmission = (e) => {
    e.preventDefault();
    registerUser({ variables: { ...formData } });
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
        className="flex flex-col gap-2 pt-4 w-3/5"
        onSubmit={(e) => handleFormSubmission(e)}
      >
        <input
          value={formData.firstName}
          required
          onChange={(e) => handleFieldChange(e)}
          name="firstName"
          className="border-2 border-gray-300 p-2 px-3 border-solid text-lg rounded-xl  focus:outline-gray-500 focus:outline-4"
          type="text"
          placeholder="First Name"
        />
        <input
          value={formData.lastName}
          required
          onChange={(e) => handleFieldChange(e)}
          name="lastName"
          className="border-2 border-gray-300 p-2 px-3 border-solid text-lg rounded-xl  focus:outline-gray-500 focus:outline-4"
          type="text"
          placeholder="Last Name"
        />
        <input
          value={formData.username}
          required
          onChange={(e) => handleFieldChange(e)}
          name="username"
          className="border-2 border-gray-300 p-2 px-3 border-solid text-lg rounded-xl  focus:outline-gray-500 focus:outline-4"
          type="text"
          placeholder="username"
        />
        <input
          value={formData.email}
          required
          onChange={(e) => handleFieldChange(e)}
          name="email"
          className="border-2 border-gray-300 p-2 px-3 border-solid text-lg rounded-xl  focus:outline-gray-500 focus:outline-4"
          type="email"
          placeholder="Email"
        />
        <input
          value={formData.password}
          required
          onChange={(e) => handleFieldChange(e)}
          name="password"
          className="border-2 border-gray-300 p-2 px-3 border-solid text-lg rounded-xl focus:outline-gray-500 focus:outline-4"
          type="password"
          placeholder="Password"
        />
        <input
          value={formData.confirmPassword}
          required
          onChange={(e) => handleFieldChange(e)}
          name="confirmPassword"
          className="border-2 border-gray-300 p-2 px-3 border-solid text-lg rounded-xl focus:outline-gray-500 focus:outline-4"
          type="password"
          placeholder="Confirm Password"
        />

        <button
          onChange={(e) => handleFieldChange(e)}
          type="submit"
          className="bg-slate-400 py-2 text-lg mt-3  rounded-full text-white font-semibold"
        >
          Sign Up
        </button>
      </form>
      {errors ? <FormErrors errors={errors} /> : null}
    </>
  );
}
