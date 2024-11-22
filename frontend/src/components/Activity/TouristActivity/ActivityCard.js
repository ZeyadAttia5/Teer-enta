import React, { useEffect, useState } from "react";
import { Button, Card, Tooltip } from "antd";
import { CalendarOutlined, ClockCircleOutlined, FolderOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { getGoogleMapsAddress } from "../../../api/googleMaps.ts";
import { useNavigate } from "react-router-dom";

const ActivityCard = ({
  id,
  name,
  date,
  time,
  location,
  price,
  category,
  currencyCode,
  currencyRate,
}) => {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await getGoogleMapsAddress(location);
        const formattedAddress =
          response.data.results[0]?.formatted_address || "Address not found";
        setAddress(formattedAddress);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };
    fetchAddress();
  }, [location?.lat, location?.lng]);

  const handleActivityDetails = () => {
    navigate(`/itinerary/activityDetails/${id}`);
  };

  const handleActivityBooking = () => {
    navigate(`/touristActivities/book/${id}`);
  };

  const handleLocationClick = () => {
    window.open(`https://www.google.com/maps?q=${location?.lat},${location?.lng}`, "_blank");
  };

  return (
    <main className="flex flex-wrap justify-center items-center py-6"> {/* Adjusted padding */}
      <div className="max-w-sm w-full rounded-lg overflow-hidden shadow-lg bg-white transform transition-all duration-300 ease-in-out m-2 cursor-pointer hover:border-2 hover:border-third">

        <Card
          className="rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out hover:text-white"
          style={{ backgroundColor: "#ffffff" }} // Default background color
        >
          <Card.Meta
            title={
              <>
                {/* Wrap the name with Tooltip */}
                <Tooltip title={name}>
                  <span
                    className="font-bold text-6xl mb-2 transition-transform duration-500 ease-out relative"
                    style={{ color: "#333333" }}
                  >
                    {name}
                    <hr className="my-4 border-t-2 border-second" />
                  </span>
                </Tooltip>
              </>
            }
            description={
              <div className="flex flex-col space-y-1 mb-0" style={{ color: "#333333" }}>
                <Tooltip title="Date">
                  <span className="font-semibold text-lg hover:text-third flex items-center">
                    <CalendarOutlined className="mr-2" />
                    {new Date(date).toLocaleDateString()}
                  </span>
                </Tooltip>
                <Tooltip title="Time">
                  <span className="font-semibold text-lg hover:text-third flex items-center">
                    <ClockCircleOutlined className="mr-2" />
                    {time}
                  </span>
                </Tooltip>
                <Tooltip title="Category">
                  <span className="font-semibold text-lg hover:text-third flex items-center">
                    <FolderOutlined className="mr-2" />
                    {category || "N/A"}
                  </span>
                </Tooltip>

                {/* Price Tooltip */}
                <div className="flex items-center justify-center gap-1 my-2"> {/* Reduced gap */}
                  <Tooltip title="" overlayClassName="bg-fourth">
                    <p className="text-xs font-bold mr-1"> {/* Smaller currency code */}
                      {currencyCode}
                    </p>
                  </Tooltip>
                  <Tooltip title="Price" overlayClassName="bg-fourth">
                    <p className="text-2xl sm:text-3xl font-bold"> {/* Larger price number */}
                      {price?.min ? (currencyRate * price.min).toFixed(1) : "N/A"},
                    </p>
                  </Tooltip>

                  <Tooltip title="" overlayClassName="bg-fourth">
                    <p className="text-xs font-bold mr-1"> {/* Smaller currency code */}</p>
                  </Tooltip>
                  <Tooltip title="Price" overlayClassName="bg-fourth">
                    <p className="text-2xl sm:text-3xl font-bold"> {/* Larger price number */}
                      {price?.max ? (currencyRate * price.max).toFixed(1) : "N/A"}
                    </p>
                  </Tooltip>
                </div>
              </div>
            }
          />
          {/* Buttons */}
          <div className="flex justify-center items-center gap-4 p-0 "> {/* Reduced gap */}
            <Button
              onClick={handleActivityDetails}
              className="text-white bg-second hover:bg-[#4a8f7a] transition-all duration-300"
            >
              Show Details
            </Button>

            <Button
              onClick={handleLocationClick}
              className="text-white bg-third hover:bg-blue-600 transition-all duration-300"
            >
              <EnvironmentOutlined className="mr-2" />
              Location
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default ActivityCard;
