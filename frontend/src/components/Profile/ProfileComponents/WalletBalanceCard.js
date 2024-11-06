import React from "react";

const WalletBalanceCard = ({currency, value}) => {
  return (
    <div className="flex items-center justify-start w-1/2 gap-3 p-3 bg-[#1c1f2f] rounded-lg">
      {/* SVG Wrapper */}
      <div className="w-7 flex items-center justify-center">
        <svg
          viewBox="0 0 24 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <rect
            x="0.539915"
            y="6.28937"
            width="21"
            height="4"
            rx="1.5"
            transform="rotate(-4.77865 0.539915 6.28937)"
            fill="#7D6B9D"
            stroke="black"
          ></rect>
          <circle
            cx="11.5"
            cy="5.5"
            r="4.5"
            fill="#E7E037"
            stroke="#F9FD50"
            strokeWidth="2"
          ></circle>
          <path
            d="M2.12011 6.64507C7.75028 6.98651 12.7643 6.94947 21.935 6.58499C22.789 6.55105 23.5 7.23329 23.5 8.08585V24C23.5 24.8284 22.8284 25.5 22 25.5H2C1.17157 25.5 0.5 24.8284 0.5 24V8.15475C0.5 7.2846 1.24157 6.59179 2.12011 6.64507Z"
            fill="#BF8AEB"
            stroke="black"
          ></path>
          <path
            d="M16 13.5H23.5V18.5H16C14.6193 18.5 13.5 17.3807 13.5 16C13.5 14.6193 14.6193 13.5 16 13.5Z"
            fill="#BF8AEB"
            stroke="black"
          ></path>
        </svg>
      </div>

      {/* Balance Wrapper */}
      <div className="flex flex-col items-start justify-start w-30 gap-0">
        <span className="text-xs text-gray-300 font-light tracking-wider">Wallet balance</span>
        <p className="text-sm text-white font-semibold tracking-wider">
          <span id="currency">{currency+" "}</span>{value}
        </p>
      </div>

      
    </div>
  );
};

export default WalletBalanceCard;
