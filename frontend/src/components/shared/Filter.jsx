import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

const Filter = ({  filterFunction, dataIndex,type }) => ({
  filterDropdown: ({ selectedKeys, setSelectedKeys, confirm }) => (
    <Input
      type={type}
      placeholder={`Search ${dataIndex}`}
      value={selectedKeys[0]}
      onChange={(e) => {
        setSelectedKeys(e.target.value ? [e.target.value] : []);
        confirm({
          closeDropdown: false,
        });
      }}
    />
  ),
  onFilter: filterFunction,

  filterIcon: (filtered) => (
    <SearchOutlined
      style={{
        color: filtered ? "#1677ff" : undefined,
      }}
    />
  ),
});

export default Filter;
