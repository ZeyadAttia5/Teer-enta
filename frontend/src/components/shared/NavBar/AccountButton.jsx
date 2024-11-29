import { FiLogOut } from "react-icons/fi";
import { ReactComponent as AccountIcon } from "../../../assets/svgs/account.svg";
import React, { useState } from "react";
const AccountButton = ({ extra_tw, onClick, setModalOpen }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  var str;
  if (!user) {
    str = "Login now";
  } else {
    str = user.username;
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={` ${extra_tw} relative transition-all hover:border-b-2 hover:border-first duration-300 ease-in-out`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={onClick}
        className="cursor-pointer  transition-all duration-300"
      >
        <div className="flex justify-center">
          <svg
            width={25}
            height={25}
            viewBox="0 0 24 24"
            fill="black"
            stroke="gray"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM7.07 18.28C7.5 17.38 10.12 16.5 12 16.5C13.88 16.5 16.51 17.38 16.93 18.28C15.57 19.36 13.86 20 12 20C10.14 20 8.43 19.36 7.07 18.28ZM18.36 16.83C16.93 15.09 13.46 14.5 12 14.5C10.54 14.5 7.07 15.09 5.64 16.83C4.62 15.49 4 13.82 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 13.82 19.38 15.49 18.36 16.83ZM12 6C10.06 6 8.5 7.56 8.5 9.5C8.5 11.44 10.06 13 12 13C13.94 13 15.5 11.44 15.5 9.5C15.5 7.56 13.94 6 12 6ZM12 11C11.17 11 10.5 10.33 10.5 9.5C10.5 8.67 11.17 8 12 8C12.83 8 13.5 8.67 13.5 9.5C13.5 10.33 12.83 11 12 11Z"
              fill="gray"
            />
          </svg>
        </div>
        <span className={`font-bold text-sm text-gray-500 leading-5`}>
          {str}
        </span>
      </button>
      {isOpen && user && (
        <div
          className="absolute left-0 top-[60px] w-40 mt-0 bg-white border border-gray-300 rounded shadow-lg z-50"
          onMouseEnter={() => setIsOpen(true)}
        >
          <button
            className="w-full font-normal px-4 py-2 text-sm text-left text-black hover:bg-gray-100"
            onClick={onClick}
          >
            Profile
          </button>
          <hr className="border-gray-300" />
          <button className="w-full font-normal px-4 py-2 text-sm text-left text-black hover:bg-gray-100"
          onClick={() => window.location.href = '/changePassword'}
          >
            Change password
          </button>
          <hr className="border-gray-300" />
          {user && (
            <button
              className="w-full font-normal flex items-center gap-1 px-4 py-2 text-sm text-left text-black hover:bg-gray-100"
              onClick={() => setModalOpen(true)}
            >
              <FiLogOut className="" />
              Log out
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountButton;
