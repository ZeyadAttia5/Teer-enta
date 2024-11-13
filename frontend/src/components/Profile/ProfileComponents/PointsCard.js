import React from "react";

const WalletBalanceCard = ({ value }) => {
  return (
    <div className="flex items-center justify-start mt-4 gap-3 p-3 bg-third rounded-lg">
      {/* SVG Wrapper */}
      <div className="w-7 flex items-center justify-center">
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
            d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
          />
        </svg>
      </div>

      {/* Balance Wrapper */}
      <div className="flex flex-col items-start justify-start w-30 gap-0">
        <span className="text-xs text-first font-bold tracking-wider">
          Points
        </span>
        <p className="text-sm text-white font-semibold tracking-wider">
          <span></span>
          {value}
        </p>
      </div>
    </div>
  );
};

export default WalletBalanceCard;
