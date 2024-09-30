import { MenuOutlined } from "@ant-design/icons";
import AccountButton from "./AccountButton";
import useMediaQuery from "use-media-antd-query";
import { Drawer } from "antd";
import { useState } from "react";

const SideBar = ({ children, classNames }) => {
  const size = useMediaQuery();
  const [open, setOpen] = useState(false);

  if (["xs", "sm", "md"].includes(size)) {
    return (
      <div>
        <MenuOutlined onClick={() => setOpen(true)} />
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          classNames={classNames}
        >
          {children}
        </Drawer>
      </div>
    );
  }
  return children;
};

const TouristNavBar = () => {
  return (
    <header className="w-full flex flex-row text-white justify-between font-bold h-16 p-12 z-10 items-center">
      <span className="font-bold flex-1 text-lg leading-7 justify-start">
        Teer Enta
        <br />
        طير انت
      </span>

      <SideBar
        classNames={{
          body: "bg-[#075B4C] text-white flex flex-col",
          header: "bg-[#075B4C]",
        }}
      >
        <div className="gap-10 lg:flex-[0.5] flex-col items-end lg:items-center lg:flex-row flex justify-between">
          {["Equipment", "About Us", "Blog"].map((item, index) => (
            <span
              key={index}
              className="text-lg leading-5 cursor-pointer after:content-[''] after:border-transparent after:border   hover:after:border-white after:flex after:w-0 after:hover:w-full after:transition-all after:duration-300"
            >
              {item}
            </span>
          ))}
        </div>
        <AccountButton extra_tw={"justify-end lg:flex-1 mt-2"} />
      </SideBar>
    </header>
  );
};

export default TouristNavBar;
