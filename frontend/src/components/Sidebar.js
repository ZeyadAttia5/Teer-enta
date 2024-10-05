// DrawerMenu.js
import React from 'react';
import { Drawer, Button } from 'antd';
import { useNavigate } from "react-router-dom";

const Sidebar = ({ visible, onClose }) => {
    const navigate = useNavigate();
    const clickOptionOne = () => {
        navigate('/historicalPlace');
    }
    const clickOptionTwo = () => {
        // navigate('/tag');
    }
    const clickOptionThree = () => {
        // navigate('/user');
    }
  return (
    <Drawer
      title="Menu"
      placement="left"
      closable={true}
      onClose={onClose}
      visible={visible}
    >
      <div className="flex flex-col">
        <Button className="mb-2" type="text" onClick={clickOptionTwo}>
          Preference Tags
        </Button>
        <Button className="mb-2" type="text" onClick={clickOptionThree}>
          Historical Tags
        </Button>
        <Button className="mb-2" type="text" onClick={clickOptionOne}>
          Historical Places
        </Button>
        <Button className="mb-2" type="text" onClick={clickOptionThree}>
          Option 3
        </Button>
        <Button className="mb-2" type="text" onClick={clickOptionThree}>
          Option 3
        </Button>
        <Button className="mb-2" type="text" onClick={clickOptionThree}>
          Option 3
        </Button>
        <Button className="mb-2" type="text" onClick={clickOptionThree}>
          Activity Category
        </Button>
      </div>
    </Drawer>
  );
};

export default Sidebar;
