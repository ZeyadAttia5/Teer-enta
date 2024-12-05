import React from "react";
import { Drawer, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  TagsOutlined,
  HistoryOutlined,
  CarryOutOutlined,
  FlagOutlined,
  ShoppingOutlined,
  UserOutlined,
  CarOutlined,
  HomeOutlined,
  PaperClipOutlined,
  GiftOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

import { LuPlane } from "react-icons/lu";
import { MdOutlineLocalActivity } from "react-icons/md";

const Sidebar = ({ visible, onClose }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleClick = (path) => {
    onClose();
    navigate(path);
  };

  const [openKeys, setOpenKeys] = React.useState([]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const renderMenuItems = (items) => {
    const filteredItems = items.filter(Boolean);
    if (filteredItems.length === 1) {
      return filteredItems[0];
    }
    return filteredItems;
  };
  return (
    <Drawer
      title="Menu"
      placement="left"
      closable={true}
      onClose={onClose}
      visible={visible}
      classNames={{
        body: "bg-fourth text-white flex flex-col items-center p-4 rounded-lg shadow-lg",
        header: "bg-fourth text-first font-bold text-lg p-4",
      }}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={[]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        className="bg-fourth"
      >
        {user && user.userRole !== "Tourist"  && user.userRole !== "TourismGovernor" && (
           
              <Menu.Item key="22" onClick={() => handleClick("/reports/")} icon={<BarChartOutlined />}>
                Dashboard
              </Menu.Item>
            
        )}
        {user &&
          (user.userRole === "Admin" ||
            user.userRole === "TourismGovernor") && (
            <Menu.SubMenu key="sub5" title="Tags" icon={<TagsOutlined />}>
              {renderMenuItems([
                user && user.userRole === "Admin" && (
                  <Menu.Item
                    key="1"
                    onClick={() => handleClick("/preference-tags")}
                    icon={<TagsOutlined />}
                  >
                    Preference Tags
                  </Menu.Item>
                ),
                user &&
                  (user.userRole === "Admin" ||
                    user.userRole === "TourismGovernor") && (
                    <Menu.Item key="2" onClick={() => handleClick("/tags")} icon={<TagsOutlined />}>
                      Tags
                    </Menu.Item>
                  ),
              ])}
            </Menu.SubMenu>
          )}
        {(user === null ||
          (user &&
            (user.userRole === "TourismGovernor" ||
              user.userRole === "Tourist" ||
              user.userRole === "Admin"))) &&
          renderMenuItems([
            <Menu.Item
              key="3"
              onClick={() => handleClick("/historicalPlace")}
              icon={<HistoryOutlined />}
            >
              Historical Places
            </Menu.Item>,
            user && user.userRole === "TourismGovernor" && (
              <Menu.Item
                key="12"
                onClick={() => handleClick("/historicalPlace/my")}
                icon={<HistoryOutlined />}
              >
                My Historical Places
              </Menu.Item>
            ),
          ])}
        {(user === null ||
          (user &&
            (user.userRole === "TourGuide" ||
              user.userRole === "Tourist" ||
              user.userRole === "Admin"))) &&
          renderMenuItems([
            <Menu.Item
                    key="4"
                    onClick={() =>
                        handleClick(
                            user && (user.userRole === "TourGuide" || user.userRole === "Admin")
                                ? "/itinerary/tourguide_itineraries"
                                : "/itinerary"
                        )
                    }
                icon={<CarryOutOutlined />}>
              Itinerary
            </Menu.Item>,
            user && user.userRole === "Admin" && (
              <Menu.Item
                key="15"
                onClick={() => handleClick("/itinerary/flaggedIternaries")}
                icon={<FlagOutlined />}
              >
                Flagged Itinerary
              </Menu.Item>
            ),
            user && user.userRole === "TourGuide" && (
              <Menu.Item key="5" onClick={() => handleClick("/itinerary/my")} icon={<CarryOutOutlined />}>
                My Itinerary
              </Menu.Item>
            ),
          ])}

        {user &&
          (user.userRole === "Advertiser" ||
            user.userRole === "Admin" ||
            user.userRole === "Tourist") && (
            <Menu.SubMenu key="sub3" title="Activities" icon={<MdOutlineLocalActivity />}>
              {renderMenuItems([
                user && user.userRole === "Admin" && (
                  <Menu.Item
                    key="6"
                    onClick={() => handleClick("/activity-categories")}
                    icon={<MdOutlineLocalActivity />}
                  >
                    Activity Categories
                  </Menu.Item>
                ),
                user && user.userRole !== "Tourist" && (
                  <Menu.Item
                    key="7"
                    onClick={() => handleClick("/activities")}
                    icon={<MdOutlineLocalActivity /> }
                  >
                    Activities
                  </Menu.Item>
                ),
                user && user.userRole === "Advertiser" && (
                  <Menu.Item
                    key="1000000"
                    onClick={() => handleClick("/unActiveActivity")}
                    icon={<MdOutlineLocalActivity />}
                  >
                    UnActive Activities
                  </Menu.Item>
                ),
                user && user.userRole === "Tourist" && (
                  <Menu.Item
                    key="1000000"
                    onClick={() => handleClick("/touristActivities")}
                    icon={<MdOutlineLocalActivity />}
                  >
                    Activities
                  </Menu.Item>
                ),
                user && user.userRole === "Tourist" && (
                  <Menu.Item
                    key="1000020"
                    onClick={() => handleClick("/savedActivities")}
                    icon={<MdOutlineLocalActivity />}
                  >
                    Saved Activities
                  </Menu.Item>
                ),
                user && user.userRole === "Admin" && (
                  <Menu.Item
                    key="16"
                    onClick={() => handleClick("/flaggedActivities")}
                    icon={<FlagOutlined />}
                  >
                    Flagged Activity
                  </Menu.Item>
                ),
                user && user.userRole === "Advertiser" && (
                  <Menu.Item
                    key="8"
                    onClick={() => handleClick("/activities/my")}
                    icon={<ShoppingOutlined />}
                  >
                    My Activities
                  </Menu.Item>
                ),
              ])}
            </Menu.SubMenu>
          )}
        {user === null && (
          <Menu.Item
            key="20"
            onClick={() => handleClick("/touristActivities")}
            icon={<ShoppingOutlined />}
          >
            Activities
          </Menu.Item>
        )}
        {user && user.userRole === "Advertiser" && (
          <Menu.Item
            key="19"
            onClick={() => handleClick("/transportation/create")}
            icon={<CarOutlined />}
          >
            Create Transportation
          </Menu.Item>
        )}
        {(user === null ||
          (user &&
            (user.userRole === "Seller" ||
              user.userRole === "Tourist" ||
              user.userRole === "Admin"))) && (
          <Menu.SubMenu key="sub6" title="Products" icon={<ShoppingOutlined />}>
            {renderMenuItems([
              <Menu.Item key="13" onClick={() => handleClick("/products")} icon={<ShoppingOutlined />}>
                All Products
              </Menu.Item>,
              user && user.userRole === "Tourist" && (
                <Menu.Item
                  key="15"
                  onClick={() => handleClick("/wishlisted_products")}
                  icon={<ShoppingOutlined />}
                >
                  Wishlist
                </Menu.Item>
              ),
              user && user.userRole === "Tourist" && (
              <Menu.Item
                key="16"
                onClick={() => handleClick("/orderHistory")}
                icon={<ShoppingOutlined />}
              >
                Orders History
              </Menu.Item>),
              user &&
                (user.userRole === "Seller" || user.userRole === "Admin") && (
                  <>
                    <Menu.Item
                      key="14"
                      onClick={() => handleClick("/products/create")}
                      icon={<ShoppingOutlined />}
                    >
                      Add Product
                    </Menu.Item>
                    <Menu.Item
                      key="21"
                      onClick={() => handleClick("/products/quantity&sales")}
                      icon={<ShoppingOutlined />}
                    >
                      Quantity & Sales
                    </Menu.Item>
                  </>
                ),
            ])}
          </Menu.SubMenu>
        )}
        {user && user.userRole === "Admin" && (
          <Menu.SubMenu key="sub2" title="Users" icon={<UserOutlined />}>
            {renderMenuItems([
              <Menu.Item key="9" onClick={() => handleClick("/allUsers")} icon={<UserOutlined />}>
                Show Users
              </Menu.Item>,
              <Menu.Item key="10" onClick={() => handleClick("/addUser")} icon={<UserOutlined />}>
                Add User
              </Menu.Item>,
              <Menu.Item
                key="11"
                onClick={() => handleClick("/pendingUsers")}
                icon={<UserOutlined />}
              >
                Pending Users
              </Menu.Item>,
            ])}
          </Menu.SubMenu>
        )}
        {(user === null || (user && user.userRole === "Tourist")) && (
          <Menu.Item
            key="19"
            onClick={() => handleClick("/transportation/book")}
            icon={<CarOutlined />}
          >
            Book Transportation
          </Menu.Item>
        )}
        {(user === null || (user && user.userRole === "Tourist")) && (
          <Menu.Item key="19" onClick={() => handleClick("/hotel/book")} icon={<HomeOutlined />}>
            Book Hotel
          </Menu.Item>
        )}
        {(user === null || (user && user.userRole === "Tourist")) && (
          <Menu.Item
            key="66"
            onClick={() => handleClick("/flight/bookFlight")}
            icon={<LuPlane />}
          >
            Book Flight
          </Menu.Item>
        )}
        {user &&
          (user.userRole === "Tourist" || user.userRole === "Admin") &&
          renderMenuItems([
            user && user.userRole === "Admin" && (
              <Menu.Item
                key="17"
                onClick={() => handleClick("/ComplaintsManagement")}
                icon={<FlagOutlined />}
              >
                Complaints Management
              </Menu.Item>
            ),
            user && user.userRole === "Tourist" && (
              <Menu.Item
                key="18"
                onClick={() => handleClick("/myComplaints")}
                icon={<FlagOutlined />}
              >
                My Complaints
              </Menu.Item>
            ),
          ])}
        {user && user.userRole === "Admin" && (
          <Menu.SubMenu key="promo" title="Promo codes" icon={<GiftOutlined />}>
            {renderMenuItems([
              <Menu.Item
                key="1701"
                onClick={() => handleClick("/promoCodesAdmin")}
                icon={<GiftOutlined />}
              >
                Promo codes
              </Menu.Item>,
            ])}
          </Menu.SubMenu>
        )}
        
      </Menu>
    </Drawer>
  );
};

export default Sidebar;

