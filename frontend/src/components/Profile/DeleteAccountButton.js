import React, { useState } from "react";
import { requestAccountDeletion } from "../../api/account.ts";
import ConfirmationModal from "../shared/ConfirmationModal.js";

const DeleteAccountButton = () => {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("accessToken");
  
    // Parse the user object
    const user = storedUser ? JSON.parse(storedUser) : null;
    const accessToken = storedAccessToken || null;
  
    const [isModalOpen, setModalOpen] = useState(false);



  const handleDelete = async () => {
    
  };

  return (
    <div>
      <button
        className="flex gap-2 items-center justify-center px-4 py-2 bg-[#02735f] text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
        onClick={() => setModalOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
        Delete account
      </button>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        message={`Are you sure you want to delete your account?`}
      />
    </div>
  );
};

export default DeleteAccountButton;
