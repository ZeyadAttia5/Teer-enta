import React, { useEffect, useState, useRef } from "react";
import { CloseOutlined, CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { latestPromoCode } from "../../api/promoCode.ts";

const PromoCodeStrip = ({
                            backgroundColor = "#FF4E50",
                            textColor = "white",
                            setVisibleFlag,
                            setVisibleFlagHome
                        }) => {
    const [visible, setVisible] = useState(true);
    const [promoCode, setPromoCode] = useState("");
    const [copied, setCopied] = useState(false);
    const isFetched = useRef(false);

    const handleClose = () => {
        setVisible(false);
        setVisibleFlag(false);
        setVisibleFlagHome(false);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(promoCode.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const fetchPromoCode = async () => {
        if (isFetched.current) return;
        isFetched.current = true;
        const response = await latestPromoCode();
        setPromoCode(response.data);
    };

    useEffect(() => {
        setVisibleFlag(visible);
        setVisibleFlagHome(visible);
        fetchPromoCode();
    }, []);

    if (!visible) return null;

    return (
        promoCode?.code && (
            <div className="w-full fixed top-0 z-50 animate-slideDown">
                <div
                    className="flex items-center justify-between px-4 py-2 h-12 shadow-lg"
                    style={{
                        background: `linear-gradient(135deg, ${backgroundColor} 0%, #FF8E53 100%)`,
                        color: textColor
                    }}
                >
                    <div className="flex-1 flex items-center justify-center gap-2 text-sm md:text-base">
                        <span className="animate-bounce">🎉</span>
                        <span>Get {promoCode.discount}% discount using</span>
                        <div className="flex items-center gap-2">
                            <code className="bg-white/20 px-3 py-1 rounded-full font-mono">
                                {promoCode.code}
                            </code>
                            <button
                                onClick={handleCopy}
                                className="p-1 hover:bg-white/20 rounded-full transition-all duration-200"
                                aria-label="Copy promocode"
                            >
                                {copied ? (
                                    <CheckOutlined className="w-4 h-4" />
                                ) : (
                                    <CopyOutlined className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-all duration-200"
                        aria-label="Close"
                    >
                        <CloseOutlined className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )
    );
};

export default PromoCodeStrip;