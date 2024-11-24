import React, { useState } from "react";
import "./SearchBar.css";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const {Search} = Input;

const TwitterSearch = ({ searchTerm, setSearchTerm }) => {
  const [searchText, setSearchText] = useState("");

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleReset = () => {
    setSearchText("");
  };

  return (
    <div className="mb-6 flex justify-center ">
      <Search
        // enterButton={<SearchOutlined className=""/>}
        placeholder="Search by name, location, or tag..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 rounded-md w-[400px]"
      />
    </div>
  );
};

export default TwitterSearch;
