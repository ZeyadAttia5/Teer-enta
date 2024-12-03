import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {
    Card,
    Typography,
    Tag,
    Space,
    List,
    Rate,
    Skeleton,
    Row,
    Col,
    Statistic,
    Avatar,
    Alert,
    Badge,
    Button,
    message, Tooltip,
} from "antd";
import {
    EnvironmentOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    UserOutlined,
    CalendarOutlined,
    TagOutlined,
    PercentageOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ShareAltOutlined,
    CopyOutlined, MailOutlined,StopOutlined,
    RocketOutlined
} from "@ant-design/icons";
import MapContainer from "../shared/GoogleMaps/GoogleMaps";
import {TActivity} from "../../types/Activity/Activity";
import StaticMap from "../shared/GoogleMaps/ViewLocation";
import {getActivity} from "../../api/activity.ts";
import {getMyCurrency} from "../../api/profile.ts";
import { useNavigate } from "react-router-dom";
const {Title, Text} = Typography;

const ActivityDetails: React.FC = () => {
    const {id: ActivityId} = useParams<{ id: string }>();
    const [activity, setActivity] = useState<TActivity | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [currency, setCurrency] = useState(null);
    const navigate = useNavigate();  

    const fetchCurrency = async () => {
        try {
            const response = await getMyCurrency();
            setCurrency(response.data);
            // console.log("Currency:", response.data);
        } catch (error) {
            console.error("Fetch currency error:", error);
        }
    }



    const handleActivityBooking = (ActivityId: string) => {
        navigate(`/touristActivities/book/${ActivityId}`);
    };


    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                const response = await getActivity(ActivityId ?? -1);
                if (![200, 201].includes(response.status))
                    throw new Error("Failed to fetch activity");
                setActivity(response.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };
        fetchCurrency();
        if (ActivityId) fetchActivity();
    }, [ActivityId]);

    if (loading) return <Skeleton active/>;
    if (error) return <Alert type="error" message={error}/>;
    if (!activity) return <Alert type="warning" message="Activity not found"/>;
// hello
    const averageRating =
        activity?.ratings?.length > 0
            ? Number(
                (
                    activity?.ratings?.reduce((acc, curr) => acc + curr.rating, 0) /
                    activity?.ratings?.length
                ).toFixed(1)
            )
            : 0;

    const handleShareEmail = () => {
        const subject = `Check out this activity: ${activity?.name}`;
        const body = `
      Activity Details:
      - Name: ${activity?.name}
      - Date: ${new Date(activity?.date).toLocaleDateString()}
      - Time: ${activity?.time}
      - Location: ${
            activity?.location
                ? `Latitude: ${activity?.location?.lat}, Longitude: ${activity?.location?.lng}`
                : "Location not specified"
        }
      - Price Range: ${
            activity?.price?.min && activity?.price?.max
                ? `${currency?.code} ${(currency?.rate * activity?.price?.min).toFixed(2)} - ${(currency?.rate * activity?.price?.max).toFixed(2)}`
                : "Not specified"
        }
      - Category: ${activity?.category?.category || "No category"}
      - Tags: ${
            activity?.preferenceTags?.length > 0
                ? activity?.preferenceTags?.map((tag) => tag.tag).join(", ")
                : "No tags"
        }

      Special Discounts:
      ${
            activity?.specialDiscounts?.length > 0
                ? activity?.specialDiscounts
                    .map(
                        (discount, index) =>
                            `${index + 1}. ${discount.discount}% OFF - ${
                                discount.Description
                            } (${discount.isAvailable ? "Available" : "Not Available"})`
                    )
                    .join("\n")
                : "No special discounts"
        }

      Ratings:
      - Total Ratings: ${activity?.ratings?.length}
      - Average Rating: ${
            activity?.ratings?.length
                ? (
                    activity?.ratings?.reduce((acc, curr) => acc + curr.rating, 0) /
                    activity?.ratings?.length
                ).toFixed(1)
                : "No ratings yet"
        }

      More details and booking: ${window.location.origin}/itinerary/activityDetails/${ActivityId}
    `;
        const mailtoLink = `mailto:?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };

    const handleCopyLink = () => {
        const link = `${window.location.origin}/itinerary/activityDetails/${ActivityId}`;
        navigator.clipboard.writeText(link).then(
            () => message.success("Link copied to clipboard!"),
            () => message.error("Failed to copy the link")
        );
    };

    const cardStyle = {
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      };
  const gradientBg = "bg-slate-400";
  const titleStyle = "text-lg font-semibold mb-4 flex items-center gap-2 text-first";

    const hoverCardStyle = {
        boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
    };

    return (
        <div className="min-h-screen p-8">
          <Space direction="vertical" size="large" className="relative w-full p-10">
            
      
            {/* Header and Main Layout */}
            <Row gutter={[16, 16]} justify="space-between" align="top">
              {/* Left Section */}
              <Col xs={34} sm={120} md={10}>
              <Card
bordered={true} // Add border to the card
className={`${cardStyle} border-third  mx-0 ml-0`}
bodyStyle={{ height: "100%" , boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'}}

>

<div className="space-y-1">
  {/* activity Name */}
  <Row justify="center" className="text-center mb-0">
<Title
level={2}
className="font-extrabold text-first mb-0"
style={{ fontSize: "7rem", marginBottom: "0.15rem", color: "#1a2b49" }}
>
{activity?.colorName} {activity?.name}
</Title>



</Row>


  {/* Description */}
  <Row justify="center" className="text-center">
    <p
      className="text-first text-lg font-medium mb-4"
      style={{ fontSize: "2rem" }}
    >
      {"Explore amazing Activity experiences!"}
    </p>
  </Row>
  <Row
    justify="center"
    align="middle"
    className="text-center space-x-2"
  >
   <div className="flex flex-col items-center space-y-1">
   <div className="flex items-center justify-center gap-1 my-2">
                      <Tooltip title="" overlayClassName="bg-fourth">
                          <p className="text-xs font-bold mr-1">{currency?.code}</p>
                      </Tooltip>
                      <Tooltip title="Price" overlayClassName="bg-fourth">
                          <p className="text-2xl sm:text-3xl font-bold">
                              { activity?.price?.min ? (currency?.rate *  activity?.price?.min).toFixed(1) : "N/A"},
                          </p>
                      </Tooltip>

                      <Tooltip title="" overlayClassName="bg-fourth">
                          <p className="text-xs font-bold mr-1"></p>
                      </Tooltip>
                      <Tooltip title="Price" overlayClassName="bg-fourth">
                          <p className="text-2xl sm:text-3xl font-bold">
                              { activity?.price?.max ? (currency?.rate *  activity?.price?.max).toFixed(1) : "N/A"}
                          </p>
                      </Tooltip>
                  </div>
<Statistic 
value={new Date(activity?.date).toLocaleDateString()}
prefix={<CalendarOutlined style={{ fontSize: '12px', marginRight: '5px' }} />}
valueStyle={{ color: "#1a2b49" }}
//title="Date"
/>

<Statistic
value={activity?.time}
prefix={<ClockCircleOutlined style={{ fontSize: '12px', marginRight: '5px' }} />}
valueStyle={{ color: "#1a2b49" }}
//title="Time"
/>
</div>


  </Row>

  {/* Tags */}
  <Row justify="space-between" align="middle" gutter={[16, 16]}>
  <Col>
<Space size="small">
<Tag
color={activity?.isActive ? "success" : "error"}
className="text-white"
style={{ fontSize: '12px' }}
>
{activity?.isActive ? (
  <>
    <CheckCircleOutlined style={{ fontSize: '10px', marginRight: '5px' }} />
    Active
  </>
) : (
  <>
    <CloseCircleOutlined style={{ fontSize: '16px', marginRight: '5px' }} />
    Inactive
  </>
)}
</Tag>
<Tag
color={activity?.isBookingOpen ? "processing" : "default"}
className="text-white"
style={{ fontSize: '12px' }}
>
{activity?.isBookingOpen ? (
  <>
    <ClockCircleOutlined style={{ fontSize: '10px', marginRight: '5px' }} />
    Booking Open
  </>
) : (
  <>
    <StopOutlined style={{ fontSize: '16px', marginRight: '5px' }} />
    Booking Closed
  </>
)}
</Tag>
</Space>
</Col>


    {/* Rating and Actions */}
    <Col>
      <Space direction="vertical" align="center">
        <Rate disabled value={averageRating} allowHalf />
        <Text type="secondary" className="text-white">
          {activity?.ratings.length} ratings
        </Text>
        <Space>
          {/* Copy Link Button with Icon and Text on Hover */}
          <div className="flex items-center gap-4">
{/* Copy Link Button */}
<div className="relative group">
{/* Invisible text, visible on hover */}
<span className="absolute left-1/2 transform -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 bg-fourth text-first text-sm px-2 py-1 rounded shadow whitespace-nowrap">
Copy Link
</span>
<Button
icon={<CopyOutlined />}
onClick={handleCopyLink}
className="text-first bg-white hover:bg-gray-200"
/>
</div>

{/* Send Mail Button */}
<div className="relative group">
{/* Invisible text, visible on hover */}
<span className="absolute left-1/2 transform -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 bg-fourth text-first text-sm px-2 py-1 rounded shadow whitespace-nowrap">
Send Mail
</span>
<Button
icon={<MailOutlined />}
onClick={handleShareEmail}
className="text-first bg-white hover:bg-gray-200"
/>
</div>
</div>

        </Space>
      </Space>
    </Col>
  </Row>
</div>

<Button
type="danger"
onClick={() => handleActivityBooking(ActivityId)}
className="w-full text-white text-4xl py-6 px-8 bg-first hover:bg-black transition-all duration-300 mt-4 shadow-lg"
style={{
fontSize: '40px', // Bigger font for the button
padding: '30px 50px', // Larger button padding
width: '100%', // Full width of the container

}}
>
Book Now
</Button>


</Card>
              </Col>
      
              {/* Right Section */}
              <Col xs={24} md={14}>
                <Row gutter={[16, 16]}>
                  
                  <Col xs={24} sm={12}>
  <Card
    title={
        <div className={titleStyle}>
      <TagOutlined className="text-third text-bold mt-2" />
      <span className="text-first text-bold text-lg mt-2">Categories & Tags</span>
    </div>
    }
    bodyStyle={{ padding: '0', margin: '0' }} // Remove internal padding
    style={{
      height: '130px', // Fixed height
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add shadow here
    }}
  >
    <div style={{ padding: '10px' }}> {/* Optional padding for inner spacing */}
      <p>
        <strong>Category:</strong>{" "}
        <Tag color="blue">{activity?.category?.category}</Tag>
      </p>
      <p>
        <strong>Tags:</strong>
        {activity?.tags?.map((tag, index) => (
          <Tag key={index} color="green">
            {tag.name}
          </Tag>
        ))}
      </p>
    </div>
  </Card>
</Col>

<Col xs={24} sm={12}>
<Card
  title={
<div className={titleStyle}>
      <PercentageOutlined className=" text-bold text-third mt-2" />
      <span className="text-first text-lg text-bold mt-2 ">Discounts</span>
    </div>
  }
  bodyStyle={{ padding: '0', margin: '0' }} // Remove internal padding
  style={{
    height: '130px', // Fixed height to ensure consistency
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // Space out elements within the card
    overflow: 'hidden', // Prevent overflow if content exceeds height
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add shadow here
  }}
>
  {activity?.specialDiscounts && activity?.specialDiscounts.length > 0 ? (
    <List
      dataSource={activity?.specialDiscounts}
      renderItem={(discount) => (
        <List.Item
          style={{
            padding: '10px', // Adequate padding for List items
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center', // Vertically center align items
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px', color: 'red' }}>
              {discount?.discount}% OFF
            </div>
            <div style={{ fontSize: '14px', color: '#555' }}>
              {discount?.Description}
            </div>
          </div>
          <div>
            <Tag color={discount?.isAvailable ? "green" : "red"}>
              {discount?.isAvailable ? "Available" : "Not Available"}
            </Tag>
          </div>
        </List.Item>
      )}
    />
  ) : (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', // Ensure it takes up the full height of the card
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: '16px', color: '#888' }}>No discounts :(</span>
    </div>
  )}
</Card>





</Col>
                </Row>
      
                {/* Comments */}
                <Card
    bordered={true}
    className={`${cardStyle}  w-full mt-4`}
    bodyStyle={{ padding: "8px 16px", height: "auto", boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
  >
<div className={titleStyle}>
      <UserOutlined className="text-third ml-1" />
      <span className="text-first text-bold text-lg">Comments</span>
    </div>

    <div className="space-y-2">
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          overflowX: "auto",
          whiteSpace: "nowrap",
          paddingBottom: "8px",
          height: "50px",
          
        }}
      >
        {activity?.comments.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={activity.comments}
            renderItem={(comment) => (
              <List.Item
                className="transition-all duration-300 text-first rounded-xl"
                style={{
                  marginRight: "10px",
                  display: "inline-flex",
                  flexShrink: 0,
                  minWidth: "150px",
                }}
              >
                <List.Item.Meta
                  className="pl-3"
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <span className="text-third text-xs">
                      {comment?.createdBy?.username}
                    </span>
                  }
                  description={
                    <Space>
                      <Text className="text-first text-xs">
                        {comment?.comment}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
            style={{ padding: 0 }}
          />
        ) : (
          <div className="text-first text-xs pl-3">No comments yet</div>
        )}
      </div>
    </div>
  </Card>
  
  <Card
    bordered={true}
    className={`${cardStyle}  w-full border-third mt-4`}
    bodyStyle={{ padding: "8px 16px", height: "250px" }}
  
title={
<div className={titleStyle}>
<EnvironmentOutlined className="text-third mt-2 ml-0 " />
      <span className="text-first text-bold text-lg mt-2 ">Location</span>
    </div>
}
bodyStyle={{ padding: 0, height: "250px" }}  // Reduced height to 250px
style={{
  ...cardStyle,
  overflow: "hidden",  // Ensures content is clipped if it overflows
  ...(hoveredCard === "location" ? hoverCardStyle : {}),
  backgroundColor: "#ffffff",
   marginTop: "20px",
   boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add shadow here
}}
onMouseEnter={() => setHoveredCard("location")}
onMouseLeave={() => setHoveredCard(null)}
>
<StaticMap longitude={activity?.location?.lng} latitude={activity?.location?.lat} />
</Card>
 
              </Col>
            </Row>
            <Row justify="center" align="middle" gutter={[16, 16]}>
{/* Activity Information Card */}

<Card
  size="small"
  style={{
    borderColor: "black",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "15px",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    backgroundColor: "#94A3B8",
    height: "auto",
    maxHeight: "250px",
    width: "100%",  // Full width by default
    maxWidth: "800px", // Maximum width to prevent the card from becoming too wide
    margin: "0 auto",  // Centers the card
  }}
  onMouseEnter={() => setHoveredCard("footer")}
  onMouseLeave={() => setHoveredCard(null)}
  className="text-center"
>
  <Row xs={24} sm={12} md={8} className="flex justify-center gap-4">
    <Col span={24}>
      <div className="text-xl font-bold text-white mb-4">
        <EnvironmentOutlined size={20} className="text-fourth" />
        <span className="ml-2">Itinerary Information</span>
      </div>

      <Space
        direction="vertical"
        size="small"
        style={{ textAlign: "center" }}
        className="mt-6 flex justify-center sm:flex sm:flex-row sm:space-x-6 sm:text-left sm:items-center sm:space-y-0"
      >
        <Text
          type="secondary"
          style={{ color: "black" }}
          className="flex items-center"
        >
          <UserOutlined className="mr-2 text-fourth" />
          <strong>Created by:</strong> {activity?.createdBy?.username}
        </Text>
        <Text
          type="secondary"
          style={{ color: "black" }}
          className="flex items-center "
        >
          <CalendarOutlined className="mr-2 text-fourth" />
          <strong>Created on:</strong>{" "}
          {new Date(activity?.createdAt ?? "").toLocaleDateString()}
        </Text>
        <Text
          type="secondary"
          style={{ color: "black" }}
          className="flex items-center"
        >
          <ClockCircleOutlined className="mr-2 text-fourth" />
          <strong>Last Updated:</strong>{" "}
          {new Date(activity?.updatedAt ?? "").toLocaleDateString()}
        </Text>
      </Space>
    </Col>

    <Col span={24}>
      <div className="mt-2 flex justify-center space-x-6">
        <a
          href="#"
          className="text-white text-lg font-medium hover:text-fourth hover:underline transition-all duration-300"
        >
          Privacy Policy
        </a>
        <a
          href="#"
          className="text-white text-lg font-medium hover:text-fourth hover:underline transition-all duration-300"
        >
          Terms of Service
        </a>
      </div>
    </Col>

    <Col span={24}>
      <div className="mt-0 text-sm text-gray-400">
        <Text>© 2024 Teer Enta. All rights reserved.</Text>
      </div>
    </Col>
  </Row>
</Card>

</Row>

          </Space>
        </div>
      );
      
      
};

export default ActivityDetails;
