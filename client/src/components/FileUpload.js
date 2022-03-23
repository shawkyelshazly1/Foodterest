import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowUp,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function FileUpload({ setImage }) {
  // States to handle file drag& drop and review
  const [fileSelected, setFileSelected] = useState(null);
  const [imagePreviewUri, setImagePreviewUri] = useState(null);
  const [togglePreview, setTogglePreview] = useState("hidden");
  const [toggleFileUpload, setToggleFileUpload] = useState("");

  //Handling file Dragover
  const onDragOverHandler = (e) => {
    e.preventDefault();
  };

  // Show image preview & selected file
  const showImagePreview = (data) => {
    setFileSelected(data);
    setImagePreviewUri(window.URL.createObjectURL(data));
    setImage(data);
    setTogglePreview("");
    setToggleFileUpload("hidden");
  };

  // clear Image preview
  const clearImagePreview = (e) => {
    setTogglePreview("hidden");
    setToggleFileUpload("");
    setImage(null);
    document.querySelector(".inputField").value = "";
  };

  // Handling file select
  const selectFileHandler = (e) => {
    e.preventDefault();

    let data = e.target.files[0];

    if (data.type.match(/image.*/)) {
      showImagePreview(data);
    }
  };

  // Handling file drop
  const onDropHandler = (e) => {
    e.preventDefault();
    if (e.dataTransfer.items) {
      let data = [...e.dataTransfer.items]
        .find((item) => item.kind === "file")
        .getAsFile();
      if (data.type.match(/image.*/)) {
        showImagePreview(data);
      }
    } else {
      let data = e.dataTransfer.items[0];
      if (data.type.match(/image.*/)) {
        showImagePreview(data);
      }
    }
  };

  return (
    <>
      <div
        className={`${toggleFileUpload} flex-1 h-full w-5/6 mx-auto  bg-[#E9E9EB] flex content-center items-center p-3 rounded-xl relative`}
        onDrop={onDropHandler}
        onDragOver={onDragOverHandler}
      >
        <label className=" cursor-pointer h-full w-full rounded-xl border-2 border-dashed border-gray-400 flex flex-1 items-center content-center justify-center">
          <div className="flex w-full flex-col justify-center items-center gap-2">
            <FontAwesomeIcon
              icon={faCircleArrowUp}
              size="2xl"
              color="#b2b2b2"
            />
            <h1 className="w-2/4 text-center">
              Drag and drop or click to upload
            </h1>
          </div>
          <input
            type="file"
            className="opacity-0 absolute cursor-pointer inputField"
            onChange={(e) => selectFileHandler(e)}
          />
        </label>
      </div>
      <div className={`relative h-full w-5/6 flex-1 mx-auto ${togglePreview}`}>
        <FontAwesomeIcon
          icon={faCircleXmark}
          size="xl"
          className="absolute top-3 left-3 cursor-pointer"
          onClick={(e) => {
            clearImagePreview();
          }}
        />
        <img
          className="rounded-xl w-full max-h-[600px] top-0 left-0  z-50"
          src={imagePreviewUri}
          alt=""
        />
      </div>
    </>
  );
}
