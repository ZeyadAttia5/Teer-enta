import { ReactComponent as AccountIcon } from "../assets/svgs/account.svg";

const AccountButton = ({ extra_tw, onClick }) => {
  return (
    <div className={`flex ${extra_tw} items-center`}>
      <button
        onClick={onClick}
        className="flex items-center cursor-pointer border border-transparent hover:border-white p-2 rounded-md transition-all duration-300"
      >
        <AccountIcon className="w-6 h-6" />
        <span className="font-bold ml-2 text-lg leading-5">Account</span>
      </button>
    </div>
  );
};

export default AccountButton;
