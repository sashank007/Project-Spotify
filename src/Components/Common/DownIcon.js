import React, { Component } from "react";

const DownIcon = props => {
  let { click, id } = props;
  return (
    <svg
      style={{ width: "24px", height: "24px" }}
      id={id}
      onClick={click}
      viewBox="0 0 24 24"
    >
      <path
        fill="#000"
        id={id}
        d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z"
      />
    </svg>
  );
};
export default DownIcon;
