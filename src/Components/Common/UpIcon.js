import React, { Component } from "react";

const UpIcon = props => {
  let { click, id } = props;
  return (
    <svg
      onClick={click}
      id={id}
      style={{ width: "30px", height: "30px" }}
      viewBox="0 0 24 24"
    >
      <path
        fill="#fff"
        id={id}
        d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z"
      />
    </svg>
  );
};

export default UpIcon;
