import React from "react";
import "./passwordRestrictions.css";

const PasswordRestrictions = ({ password, isSubmitted, confirmPassword }) => {
  const isMin = password.length < 8;
  const isUpper = !/[A-Z]/.test(password);
  const isLower = !/[a-z]/.test(password);
  const isNum = !/[0-9]/.test(password);
  const isSpecial = !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

  return (
    
    <div>
      {isSubmitted && (isMin || isUpper || isLower || isNum || isSpecial || confirmPassword !== password || password == "") && (
        <div className="error-prompt-wrap">
          <div className="notifications-container">
            <div className="error-alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    className="error-svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </div>

                <div className="error-prompt-container">
                  <p className="error-prompt-heading">
                    Your password isn't strong enough
                  </p>
                  <ul className="error-prompt-list" role="list">
                    {isMin && <li>Password must be at least 8 characters</li>}
                    {isUpper && (
                      <li>
                        Password must contain at least one uppercase letter
                      </li>
                    )}
                    {isLower && (
                      <li>
                        Password must contain at least one lowercase letter
                      </li>
                    )}
                    {isNum && (
                      <li>Password must contain at least one number</li>
                    )}
                    {isSpecial && (
                      <li>
                        Password must contain at least one special character
                        (eg. @, $, %..)
                      </li>
                    )}
                    {password !== confirmPassword && (
                      <li>Passwords do not match</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordRestrictions;
