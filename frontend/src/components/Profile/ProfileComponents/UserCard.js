import React from "react";
import WalletBalanceCard from "./WalletBalanceCard";
import CurrencyDropdown1 from "./tmp";
import level1 from "../../../assets/level1.png";
import level2 from "../../../assets/level2.png";
import level3 from "../../../assets/level3.png";
import "./style.css";
import PointsCard from "./PointsCard";

const UserCard = ({
  username,
  wallet,
  currency,
  points,
  userRole,
  rate,
  setCurrencyId,
  isEditable,
  level,
}) => {
  return (
    <div className="bg-third  p-4 rounded-lg m-8 w-[350px] h-[300px] shadow-2xl flex flex-col justify-between">
      <style>
        {`
  .card_box span::before {
    content: '${level == 1 ? "Level 1" : level == 2 ? "Level 2" : "Level 3"}';
    @apply text-white bg-first font-semibold text-sm px-2 py-1 rounded;
  }
  `}
      </style>
      {/* <div class="card_box">
        <span></span>
      </div> */}

      <div className="flex gap-4">
        <span></span>
        {/* Image */}
        {/* <div className="h-28 w-1/2 bg-gradient-to-br from-purple-700 to-purple-400 rounded-lg"></div> */}
        <div className="card_box">
          <span></span>
          <img
            src={level == 1 ? level1 : level == 2 ? level2 : level3}
            alt={`${userRole} level`}
            className="object-cover rounded-lg w-full"
          />
        </div>
        {/* Info Section */}
        <div className="flex flex-col justify-between h-28 w-full flex-1">
          <div>
            {/* Name and Function */}
            <p className="text-xl font-medium text-white">{username}</p>
            <p className="text-sm text-fifth">{userRole}</p>
          </div>

          {/* <div className="w-full bg-white rounded-lg p-2 text-sm text-black">
            <p className="flex flex-col items-left">
              Points
            </p>
              <span className="font-bold text-purple-700 align-middle">{points}</span>
          </div> */}
          <PointsCard value={points} />
        </div>
      </div>
      
        <WalletBalanceCard
          currency={currency}
          value={(wallet * rate || 0).toFixed(2)}
        />
        
      
    </div>
  );
};

export default UserCard;
