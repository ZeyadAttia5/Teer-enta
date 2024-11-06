import React from "react";
import WalletBalanceCard from "./WalletBalanceCard";
import CurrencyDropdown1 from "./tmp";

const UserCard = ({
  username,
  wallet,
  currency,
  points,
  userRole,
  rate,
  setCurrencyId,
  isEditable
}) => {
  return (
    <div className="max-w-xs bg-gray-800 p-4 rounded-lg h-fit m-8 w-full">
      {/* Infos Section */}
      <div className="flex gap-4">
        {/* Image */}
        <div className="h-28 w-1/2 bg-gradient-to-br from-purple-700 to-purple-400 rounded-lg"></div>

        {/* Info Section */}
        <div className="flex flex-col justify-between h-28 w-full flex-1">
          <div>
            {/* Name and Function */}
            <p className="text-xl font-medium text-white">{username}</p>
            <p className="text-sm text-gray-400">{userRole}</p>
          </div>

          {/* Stats */}
          <div className="w-fit bg-white rounded-lg p-2 text-sm text-black">
            <p className="flex flex-col items-center">
              Points
              <span className="font-bold text-purple-700">{points}</span>
            </p>
            
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <WalletBalanceCard currency={currency} value={wallet * rate || 0} />
        <div className="flex flex-col justify-center w-[40%]">
          <CurrencyDropdown1 setCurrencyId={setCurrencyId} isEditable={isEditable} />
        </div>
      </div>
    </div>
  );
};

export default UserCard;
