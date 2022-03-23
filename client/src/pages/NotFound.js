import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex flex-row">
        <p className="font-Roboto font-bold text-xl text-gray-600 px-5 py-3 border-r-4 border-r-gray-600">
          404
        </p>
        <p className="font-Roboto font-bold text-xl text-gray-600 px-5 py-3 ">
          The Page Is Not Found!
        </p>
      </div>
      <Link to="/" className="rounded-full bg-black text-xl font-semibold text-white px-4 py-3 font-Roboto mr-9">
        Home
      </Link>
    </div>
  );
}
