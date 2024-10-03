import { ReactComponent as AccountIcon } from "../assets/svgs/account.svg";

const AccountButton = ({ extra_tw, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex  ${extra_tw} items-center cursor-pointer `}
    >
      <AccountIcon className="w-6 h-6" />
      <span className="font-bold ml-2 text-lg leading-5">Account</span>
    </div>
  );
};

export default AccountButton;
