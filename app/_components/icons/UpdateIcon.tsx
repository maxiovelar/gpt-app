import React from "react";

export const UpdateIcon = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="#1ad197"
      width="20px"
      height="20px"
      viewBox="0 0 24 24"
      id="update"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />

      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g id="SVGRepo_iconCarrier">
        <path
          id="primary"
          d="M4,12A8,8,0,0,1,18.93,8"
          fill="none"
          stroke="#1ad197"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />

        <path
          id="primary-2"
          data-name="primary"
          d="M20,12A8,8,0,0,1,5.07,16"
          fill="none"
          stroke="#1ad197"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />

        <polyline
          id="primary-3"
          data-name="primary"
          points="14 8 19 8 19 3"
          fill="none"
          stroke="#1ad197"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />

        <polyline
          id="primary-4"
          data-name="primary"
          points="10 16 5 16 5 21"
          fill="none"
          stroke="#1ad197"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </g>
    </svg>
  );
};
