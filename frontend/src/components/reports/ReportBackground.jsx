import React from "react";
import emptyreciept from "../../assets/reciept.png";
const ReportBackground = ({children}) => {
  return (
      <div className="size-full min-h-screen flex justify-center bg-reports-bg bg-no-repeat bg-fit">
          <div className="relative grid justify-center content-center shadow-2xl p-12 max-w-[95vw]">
              <img
                  src={emptyreciept}
                  alt="background"
                  className="mx-auto col-[1] row-[1] w-full h-full shadow-2xl rounded-2xl"
              />
              <div className="flex flex-col gap-6 w-full h-full col-[1] row-[1] z-50 p-8 overflow-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {children}
                  </div>
              </div>
          </div>
      </div>
  );
};

export default ReportBackground;
