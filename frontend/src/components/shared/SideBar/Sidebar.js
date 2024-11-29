import React from "react";
import {Drawer, Menu} from "antd";
import {useNavigate} from "react-router-dom";

const Sidebar = ({visible, onClose}) => {
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
          {user &&
            (user.userRole === "Admin" ||
              user.userRole === "TourismGovernor") && (
              <Menu.SubMenu key="sub5" title="Tags">
                {renderMenuItems([
                  user && user.userRole === "Admin" && (
                    <Menu.Item
                      key="1"
                      onClick={() => handleClick("/preference-tags")}
                    >
                      Preference Tags
                    </Menu.Item>
                  ),
                  user &&
                    (user.userRole === "Admin" ||
                      user.userRole === "TourismGovernor") && (
                      <Menu.Item key="2" onClick={() => handleClick("/tags")}>
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
              >
                Historical Places
              </Menu.Item>,
              user && user.userRole === "TourismGovernor" && (
                <Menu.Item
                  key="12"
                  onClick={() => handleClick("/historicalPlace/my")}
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
              <Menu.Item key="4" onClick={() => handleClick("/itinerary")}>
                Itinerary
              </Menu.Item>,
              user && user.userRole === "Admin" && (
                <Menu.Item
                  key="15"
                  onClick={() => handleClick("/itinerary/flaggedIternaries")}
                >
                  Flagged Itinerary
                </Menu.Item>
              ),
              user && user.userRole === "TourGuide" && (
                <Menu.Item
                  key="2000"
                  onClick={() => handleClick("/itinerary/unActiveIternaries")}
                >
                  UnActive Itinerary
                </Menu.Item>
              ),
              user && user.userRole === "TourGuide" && (
                <Menu.Item key="5" onClick={() => handleClick("/itinerary/my")}>
                  My Itinerary
                </Menu.Item>
              ),
            ])}
          {user &&
            (user.userRole === "Advertiser" ||
              user.userRole === "Admin" ||
              user.userRole === "Tourist") && (
              <Menu.SubMenu key="sub3" title="Activities">
                {renderMenuItems([
                  user && user.userRole === "Admin" && (
                    <Menu.Item
                      key="6"
                      onClick={() => handleClick("/activity-categories")}
                    >
                      Activity Categories
                    </Menu.Item>
                  ),
                  user && user.userRole !== "Tourist" && (
                    <Menu.Item
                      key="7"
                      onClick={() => handleClick("/activities")}
                    >
                      Activities
                    </Menu.Item>
                  ),
                  user && user.userRole === "Advertiser" && (
                    <Menu.Item
                      key="1000000"
                      onClick={() => handleClick("/unActiveActivity")}
                    >
                      UnActive Activities
                    </Menu.Item>
                  ),
                  user && user.userRole === "Tourist" && (
                    <Menu.Item
                      key="1000000"
                      onClick={() => handleClick("/touristActivities")}
                    >
                      Activities
                    </Menu.Item>
                  ),
                  user && user.userRole === "Tourist" && (
                    <Menu.Item
                      key="1000020"
                      onClick={() => handleClick("/savedActivities")}
                    >
                      saved Activities
                    </Menu.Item>
                  ),
                  user && user.userRole === "Admin" && (
                    <Menu.Item
                      key="16"
                      onClick={() => handleClick("/flaggedActivities")}
                    >
                      Flagged Activity
                    </Menu.Item>
                  ),
                  user && user.userRole === "Advertiser" && (
                    <Menu.Item
                      key="8"
                      onClick={() => handleClick("/activities/my")}
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
            >
              Activities
            </Menu.Item>
          )}
          {user && user.userRole === "Advertiser" && (
            <Menu.Item
              key="19"
              onClick={() => handleClick("/transportation/create")}
            >
              Create Transportation
            </Menu.Item>
          )}
          {(user === null ||
            (user &&
              (user.userRole === "Seller" ||
                user.userRole === "Tourist" ||
                user.userRole === "Admin"))) && (
            <Menu.SubMenu key="sub6" title="Products">
              {renderMenuItems([
                <Menu.Item key="13" onClick={() => handleClick("/products")}>
                  All Products
                </Menu.Item>,
                  user && user.userRole === "Tourist" && (
                <Menu.Item
                  key="15"
                  onClick={() => handleClick("/wishlisted_products")}
                >
                  Wishlist
                </Menu.Item>,
                <Menu.Item
                  key="16"
                  onClick={() => handleClick("/orderHistory")}
                >
                  Orders History
                </Menu.Item>),
                user &&
                  (user.userRole === "Seller" || user.userRole === "Admin") && (
                    <>
                      <Menu.Item
                        key="14"
                        onClick={() => handleClick("/products/create")}
                      >
                        Add Product
                      </Menu.Item>
                      <Menu.Item
                        key="21"
                        onClick={() => handleClick("/products/quantity&sales")}
                      >
                        Quantity & Sales
                      </Menu.Item>
                    </>
                  ),
              ])}
            </Menu.SubMenu>
          )}
          {user && user.userRole === "Admin" && (
            <Menu.SubMenu key="sub2" title="Users">
              {renderMenuItems([
                <Menu.Item key="9" onClick={() => handleClick("/allUsers")}>
                  Show Users
                </Menu.Item>,
                <Menu.Item key="10" onClick={() => handleClick("/addUser")}>
                  Add User
                </Menu.Item>,
                <Menu.Item
                  key="11"
                  onClick={() => handleClick("/pendingUsers")}
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
            >
              Book Transportation
            </Menu.Item>
          )}
          {(user === null || (user && user.userRole === "Tourist")) && (
            <Menu.Item key="19" onClick={() => handleClick("/hotel/book")}>
              Book Hotel
            </Menu.Item>
          )}
          {(user === null || (user && user.userRole === "Tourist")) && (
            <Menu.Item
              key="66"
              onClick={() => handleClick("/flight/bookFlight")}
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
                >
                  Complaints Management
                </Menu.Item>
              ),
              user && user.userRole === "Tourist" && (
                <Menu.Item
                  key="18"
                  onClick={() => handleClick("/myComplaints")}
                >
                  My Complaints
                </Menu.Item>
              ),
            ])}
          {user && user.userRole === "Admin" && (
            <Menu.SubMenu key="promo" title="Promo codes">
              {renderMenuItems([
                <Menu.Item
                  key="1701"
                  onClick={() => handleClick("/promoCodesAdmin")}
                >
                  Promo codes
                </Menu.Item>,
              ])}
            </Menu.SubMenu>
          )}
          {user && user.userRole !== "Tourist" && (
            <Menu.Item key="22" onClick={() => handleClick("/reports/")}>
              Reports
            </Menu.Item>
          )}
        </Menu>
      </Drawer>
    );
};

export default Sidebar;