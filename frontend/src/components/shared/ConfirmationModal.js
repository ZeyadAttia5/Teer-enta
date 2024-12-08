import React from "react";
import {Link} from "react-router-dom";
import {requestAccountDeletion} from "../../api/account.ts";
import {useNavigate} from "react-router-dom";
import {message, message as messageAd} from "antd";

function ConfirmationModal({isOpen, onClose, onConfirm ,message}) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!isOpen) return null;
    const handleModalClick = async (e) => {
        try{
            onConfirm();

            if (message === "Are you sure you want to delete your account?") {
                    const response = await requestAccountDeletion();
                    messageAd.success(response.data.message);
                    if (user === "Tourist") {
                        localStorage.clear();
                        window.location.href = "/";
                    }else{
                        if(response.data.message === "Account deleted successfully"){
                            localStorage.clear();
                            window.location.href = "/";
                        }else{
                            window.location.href = "/reports";
                        }
                    };
                    
            }
            if (message === "Are you sure you want to log out?") {
                // localStorage.removeItem("user");
                // localStorage.removeItem("accessToken");
                // localStorage.removeItem("isAuthenticated");
                // delete all localStorage items
                localStorage.clear();
                navigate("/");
                // window.location.reload();
            }
        }catch (error){
            messageAd.info(error.response.data.message);
            console.error(error);
        }finally{
            onClose();
        }

    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-96">
                <h2 className="text-lg font-semibold mb-4">Confirmation</h2>
                <p className="mb-4">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none"
                    >
                        Cancel
                    </button>
                    {onConfirm && (
                        <button
                            onClick={handleModalClick}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
                        >
                            Confirm
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
