import React, {useEffect, useState} from "react";
import {CloseOutlined} from "@ant-design/icons";
import {latestPromoCode} from "../../api/promoCode.ts";

const PromoCodeStrip = ({backgroundColor = "red", textColor = "white"}) => {
    const [visible, setVisible] = useState(true);
    const [promoCode, setPromoCode] = useState("");

    const handleClose = () => {
        setVisible(false);
    };

    const fetchPromoCode = async () => {
        const response = await latestPromoCode();
        setPromoCode(response.data);
    }

    useEffect(() => {
        fetchPromoCode();
    })

    if (!visible) return null;

    return (
        <div className="flex items-center justify-between bg-red-500 text-white p-0 rounded-md shadow-lg space-x-4">
            <div className="flex row justify-center items-center w-full">
                <div className="">
                    <span className="text-md "> 🎉 Get {promoCode.discount}% discount by using </span>
                </div>
                <card >
                    <span className="font-bold text-md">
                      : {promoCode.code}
                    </span>
                </card>

            </div>
            <button
                onClick={handleClose}
                className="text-lg p-2 hover:text-gray-300 transition-all rounded-md"
                aria-label="Close"
            >
                <CloseOutlined/>
            </button>
        </div>);
};

export default PromoCodeStrip;
