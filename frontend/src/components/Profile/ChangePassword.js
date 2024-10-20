import React from "react";
import { changePassword } from "../../api/auth.ts";
import PasswordRestrictions from "../Auth/Signup/PasswordRestrictions.js";
const ChangePassword = () => {
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [oldPassword, setOldPassword] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await changePassword({
        oldPassword: oldPassword,
        newPassword: newPassword,
      });
    } catch (error) {
      setMessage(error.response.data.message);
      return;
    }

    if (!isValid()) {
      return false;
    }
  };

  const isValid = () => {
    
    setMessage("");
    setIsSubmitted(true);
    return true;
  };

  return (
    <section>
      <div class="bg-white relative items-center w-full px-5 py-12 mx-auto md:px-12 lg:px-20 max-w-7xl">
        <div class="w-full max-w-md mx-auto md:max-w-sm md:px-0 md:w-96 sm:px-4">
          <div class="flex flex-col">
            <div>
              <h2 class="text-4xl text-black">Reset password</h2>
            </div>
          </div>
          <form>
            <input
              value="https://jamstacker.studio/thankyou"
              type="hidden"
              name="_redirect"
            />
            <div class="mt-4 space-y-6">
              <div class="col-span-full">
                <div className="mb-3 flex justify-between text-sm font-medium text-gray-600">
                  
                  <div>Old password</div>
                  {message && (
                <div className="col-span-full mb-2">
                  <p className="text-sm text-center text-red-600">
                    {" "}
                    {message}{" "}
                  </p>
                </div>
              )}
                </div>
                <input
                  type="password"
                  placeholder="******"
                  class="block w-full px-6 py-3 text-black bg-white border border-gray-200 rounded-full appearance-none placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div class="col-span-full">
                <label class="block mb-3 text-sm font-medium text-gray-600">
                  {" "}
                  New password{" "}
                </label>
                <input
                  type="password"
                  placeholder="******"
                  class="block w-full px-6 py-3 text-black bg-white border border-gray-200 rounded-full appearance-none placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div class="col-span-full">
                <label class="block mb-3 text-sm font-medium text-gray-600">
                  {" "}
                  Confirm new password{" "}
                </label>
                <input
                  type="password"
                  placeholder="******"
                  class="block w-full px-6 py-3 text-black bg-white border border-gray-200 rounded-full appearance-none placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              
            </div>
            <PasswordRestrictions
              password={newPassword}
              confirmPassword={confirmPassword}
              isSubmitted={isSubmitted}
            />
            <div class="col-span-full">
              <button
                type="submit"
                className="items-center mt-4 justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full nline-flex hover:bg-[#444]  hover:text-white focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
                onClick={handleSubmit}
              >
                {" "}
                Submit your request{" "}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
