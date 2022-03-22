import React, { useState } from "react";
import Login from "../components/Login";
import SuccessMessageModal from "../components/reusable/SuccessMessageModal";
import Signup from "../components/Signup";

export default function AuthPage() {
  // State to switch between components
  const [component, setComponent] = useState("login");
  const [successMessage, setSuccessMessage] = useState(null);

  return (
    <div className="flex flex-1 bg-mainBg bg-cover">
      <div className="bg-blackCoverFade flex flex-1 flex-row items-center px-80 justify-between ">
        {successMessage ? (
          <SuccessMessageModal
            setSuccessMessage={setSuccessMessage}
            message={successMessage}
          />
        ) : null}
        <h1 className="text-7xl text-white font-bold font-Roboto w-1/3">
          Signup to get your ideas
        </h1>

        <div className="bg-white  rounded-2xl w-[500px] ">
          <div className="flex flex-col gap-3 items-center pb-14  mx-auto w-full ">
            <img
              src="https://res.cloudinary.com/dwufx31ox/image/upload/v1647960558/Foodterest/logo_transparent_kvapzz.png"
              alt="asd"
              className=" w-44 py-3"
            />
            <h3 className="font-Roboto text-3xl font-semibold text-gray-700  text-center">
              Welcome to Foodterest
            </h3>
            {component === "login" ? (
              <>
                <Login />
                <p
                  className="relative float-left ml-3  pt-3 text-md cursor-pointer font-semibold text-gray-700"
                  onClick={(e) => {
                    setComponent("signup");
                  }}
                >
                  Not on Foodterest yet? Sign up
                </p>
              </>
            ) : (
              <>
                <Signup
                  setComponent={setComponent}
                  setSuccessMessage={setSuccessMessage}
                />
                <p
                  className="relative float-left ml-3  pt-3 text-md cursor-pointer font-semibold text-gray-700"
                  onClick={(e) => {
                    setComponent("login");
                  }}
                >
                  Already a member? Log in
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
