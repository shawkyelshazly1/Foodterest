import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

export default function CommentFilledComponent({ size }) {
  return <FontAwesomeIcon size={size} icon={faComment} color="#FFF" />;
}
