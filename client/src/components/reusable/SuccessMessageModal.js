import React from "react";

export default function SuccessMessageModal({ message, setSuccessMessage }) {
  // Component to show modal success message
  return (
    <div className=" absolute top-5 left-0 bottom-0 right-0 flex justify-center h-fit">
      <div className="bg-green-500 w-fit px-7 py-3 rounded-full">
        <div className="flex flex-row justify-between">
          <h1 className="text-white text-lg font-semibold">{message}</h1>
          <span
            className="ml-5 text-black rounded-full px-1 font-bold text-lg font-Roboto  cursor-pointer"
            onClick={() => {
              setSuccessMessage(null);
            }}
          >
            x
          </span>
        </div>
      </div>
    </div>
  );
}
