import React from "react";

export default function FormErrors({ errors }) {
  // Form errors component
  return (
    <ul className="list-disc mb-0 w-3/4 mx-auto ">
      {errors.map((error) => (
        <li className="text-red-400" key={error.path[0]}>
          {error.message}
        </li>
      ))}
    </ul>
  );
}
