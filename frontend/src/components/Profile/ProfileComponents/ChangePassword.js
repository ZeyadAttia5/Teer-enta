import React from "react";
import { changePassword } from "../../../api/auth.ts";
import Button from "antd";
import PasswordRestrictions from "../../Auth/Signup/PasswordRestrictions.js";
const ChangePassword = () => {
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [oldPassword, setOldPassword] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isValidVariable, setIsValidVariable] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) {
      return false;
    }
    try {
      const response = await changePassword({
        oldPassword: oldPassword,
        newPassword: newPassword,
      });
    } catch (error) {
      setMessage(error.response.data.message);
      return;
    }

    window.location.href = "/";
  };

  const isValid = () => {
    
    setMessage("");
    if(newPassword !== confirmPassword){
      setMessage("Passwords do not match");
      return false;
    }
    if(newPassword === ""){
      setMessage("Password cannot be empty");
      return false;
    }
    if(oldPassword === ""){
      setMessage("Old password cannot be empty");
      return false;
    }
    setIsSubmitted(true);
    if(!isValidVariable)
      return false;
    return true;
  };

  return (
    <section>
      <div class="bg-white relative items-center w-full px-5 py-12 mx-auto md:px-12 lg:px-20 max-w-7xl">
        <div class="w-full max-w-md mx-auto md:max-w-sm md:px-0 md:w-96 sm:px-4">
          <button
            className="mb-4 text-blue-500 hover:underline"
            onClick={() => window.history.back()}
          >
            <span className=" text-2xl">←</span>Back
          </button>
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
              setIsValidVariable={setIsValidVariable}
              isSubmitted={isSubmitted}
            />
            <div class="col-span-full">
              <button
                type="submit"
                className="items-center mt-4 justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-second border-2 rounded-full nline-flex hover:bg-third  hover:text-white focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
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
