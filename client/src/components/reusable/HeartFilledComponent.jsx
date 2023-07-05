import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export default function HeartFilledComponent({
  size,
  onClick,
  cursor,
  animation,
}) {
  return (
    <FontAwesomeIcon
      size={size}
      icon={faHeart}
      color="#FE5440"
      className={`${cursor} ${animation}`}
      onClick={(e) => onClick(e)}
    />
  );
}
