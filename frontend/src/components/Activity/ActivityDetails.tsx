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
    message,
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
    CopyOutlined, MailOutlined,
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
        transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "var(--fourth)",
        color: "#496989",
        
    
    };

    const hoverCardStyle = {
        boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
    };

    return (
        <div
          style={{
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: "#DDE6ED",
            padding: "24px"
          }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%", margin: "0 auto" }}>
      
            {/* Header and Basic Information in Same Row */}
            <Row gutter={[16, 16]} justify="space-between" align="top">
              
              {/* Header Section */}
              <Col xs={24} md={12}>
                <Card
                  style={{
                    ...cardStyle,
                    ...(hoveredCard === "header" ? hoverCardStyle : {}),
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                    padding: '0px',
                    backgroundColor: '#FFFFFF',
                    width: '100%',
                   // maxHeight:"100%",
                   // height: "245px"
                  }}
                  onMouseEnter={() => setHoveredCard("header")}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="bg-white"
                >
                  <Row justify="space-between" align="middle" gutter={[16, 16]}>
                    {/* Left Column */}
                    <Col xs={24} sm={24} md={15} style={{ padding: '0' }}>
                      <Title
                        level={1}
                        style={{
                          color: "#1a2b49",
                          fontWeight: 'bold',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                          fontSize: '100px',
                          margin: '0',
                        }}
                      >
                        {activity?.colorName} {activity?.name}
                      </Title>
                      <Rate
                        disabled
                        value={averageRating}
                        allowHalf
                        style={{ fontSize: '28px', marginTop: '4px' }}
                      />
                      <Text
                        type="secondary"
                        style={{
                          color: "#DDE6ED",
                          fontSize: '14px',
                          display: 'block',
                          marginTop: '2px',
                        }}
                      >
                        {activity?.ratings?.length} ratings
                      </Text>
                    </Col>
      
                    {/* Right Column */}
                    <Col xs={22} sm={20} md={9}>
                      <Space direction="vertical" align="end" size={2}>
                        {/* Badges */}
                        <Space size="small">
                          <Badge
                            status={activity?.isActive ? "success" : "error"}
                            text={activity?.isActive ? "Active" : "Inactive"}
                            style={{ fontSize: '12px' }}
                          />
                          <Badge
                            status={activity?.isBookingOpen ? "processing" : "default"}
                            text={activity?.isBookingOpen ? "Booking Open" : "Booking Closed"}
                            style={{ fontSize: '12px' }}
                          />
                        </Space>
                        {/* Buttons */}
                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                          
                          <Space size={4}>
                            <Button
                              icon={<CopyOutlined style={{ fontSize: '14px' }} />}
                              onClick={handleCopyLink}
                              className="text-white bg-second hover:bg-[#3b5b68] transition-all duration-200"
                              style={{ fontSize: '14px', padding: '6px 12px' }}
                            >
                              Copy Link
                            </Button>
                            <Button
                              icon={<MailOutlined style={{ fontSize: '14px' }} />}
                              onClick={handleShareEmail}
                              className="text-white bg-second hover:bg-[#3b5b68] transition-all duration-200"
                              style={{ fontSize: '14px', padding: '6px 12px' }}
                            >
                              Share via Email
                            </Button>
                          </Space>
                        </Space>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              </Col>
      
              {/* Basic Info Section */}
              <Col xs={24} md={12}>
                <Card
                  title={<Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a2b49' }}>Basic Information</Text>}
                  style={{
                    ...cardStyle,
                    ...(hoveredCard === "basicInfo" ? hoverCardStyle : {}),
                    backgroundColor: 'white',
                    height: "233px",
                  }}
                  onMouseEnter={() => setHoveredCard("basicInfo")}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: "#526D82" }}>Date</Text>}
                        value={new Date(activity?.date).toLocaleDateString()}
                        prefix={<CalendarOutlined style={{ fontSize: '15px', marginRight: '5px' }} />}
                        valueStyle={{ color: "#1a2b49" }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<Text style={{ color: "#526D82" }}>Time</Text>}
                        value={activity?.time}
                        prefix={<ClockCircleOutlined style={{ fontSize: '15px', marginRight: '5px' }} />}
                        valueStyle={{ color: "#1a2b49" }}
                      />
                    </Col>
                    <Col span={24}>
                      <Statistic
                        title={<Text style={{ color: "#526D82" }}>Price Range</Text>}
                        value={
                          activity?.price?.min && activity?.price?.max
                            ? `${currency?.code} ${(currency?.rate * activity?.price?.min).toFixed(2)} - ${(currency?.rate * activity?.price?.max).toFixed(2)}`
                            : "Not specified"
                        }
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
              
            </Row>
      
            {/* Location, Category & Discount Section */}
            <Row gutter={[16, 16]} justify="space-between" align="top">
              
              {/* Category & Tags Section */}
              <Col xs={24} lg={12}>
  <Row gutter={16}> {/* Row for controlling space between cards */}
    <Col span={24}> {/* Each card will take full width of the column */}
      <Card
        title={
          <Space>
            <TagOutlined style={{ color: "#58A399" }} />
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a2b49' }}>Category & Tags</span>
          </Space>
        }
        style={{
          ...cardStyle,
          ...(hoveredCard === "categoryTags" ? hoverCardStyle : {}),
          backgroundColor: 'white',
          width: '100%',  // Ensures cards take up full column width
          marginBottom: '16px', // Adds space between cards
        }}
        onMouseEnter={() => setHoveredCard("categoryTags")}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <Row gutter={16}>
          <Col span={12}>
            <div>
              <Text strong style={{ fontSize: '16px', color: '#1a2b49' }}>Category: </Text>
              <Tag color="blue" style={{ fontSize: '16px' }}>
                {activity?.category?.category}
              </Tag>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Text strong style={{ fontSize: '16px', color: '#1a2b49', marginRight: '10px' }}>
                Preference Tags:
              </Text>
              <Space wrap style={{ display: 'flex', gap: '10px' }}>
                {activity?.tags?.map((tag, index) => (
                  <Tag key={index} color="green">
                    {tag.name}
                  </Tag>
                ))}
              </Space>
            </div>
          </Col>
        </Row>
      </Card>
    </Col>

    {/* Special Discounts Section (conditionally render) */}
    {activity.specialDiscounts.length > 0 && (
      <Col span={24}>
     <Card
  title={
    <Space>
      <PercentageOutlined style={{ color: "#58A399" }} />
      <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a2b49' }}>Special Discounts</span>
    </Space>
  }
  style={{
    ...cardStyle,
    ...(hoveredCard === "specialDiscounts" ? hoverCardStyle : {}),
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    padding: '0px', // Remove all padding inside the card
    backgroundColor: '#ffffff',
    width: '100%', // Ensures cards take up full column width
    marginBottom: '5px', // Reduced bottom margin
    height: 'auto', // Auto height to shrink the card
  }}
  onMouseEnter={() => setHoveredCard("specialDiscounts")}
  onMouseLeave={() => setHoveredCard(null)}
>
  <List
    dataSource={activity.specialDiscounts}
    renderItem={(discount) => (
      <List.Item
        extra={
          discount.isAvailable ? (
            <Tag color="success" icon={<CheckCircleOutlined />}>
              Available
            </Tag>
          ) : (
            <Tag color="error" icon={<CloseCircleOutlined />}>
              Not Available
            </Tag>
          )
        }
        style={{ padding: '0px' }} // Remove extra padding between list items
      >
        <List.Item.Meta
          title={
            <Text style={{ color: "red", fontSize: "44px", fontWeight: 'bold' }}>
              {`${discount?.discount}% OFF`}
            </Text>
          }
          description={<Text style={{ color: "#1a2b49", fontSize: '14px' }}>{discount?.Description}</Text>}
        />
      </List.Item>
    )}
  />
</Card>



      </Col>
    )}
  </Row>
</Col>

      
              {/* Location Section */}
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <Space>
                      <EnvironmentOutlined style={{ color: "#58A399" }} />
                      <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a2b49' }}>Location</span>
                    </Space>
                  }
                  bodyStyle={{ padding: 0, height: "300px" }}
                  style={{
                    ...cardStyle,
                    overflow: "hidden",
                    backgroundColor: "white",
                    ...(hoveredCard === "location" ? hoverCardStyle : {}),
                  }}
                  onMouseEnter={() => setHoveredCard("location")}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <StaticMap longitude={activity?.location?.lng} latitude={activity?.location?.lat} />
                </Card>
              </Col>
              
            </Row>

           
                {/* Comments */}
                {activity?.comments.length > 0 && (
                    <Card
                        bordered={true}  // Add border to the card
                        className={`${cardStyle} w-full border-white`} // Gradient background and white border
                        bodyStyle={{ height: '100%' }}
                    >
                        <div>
                            <span className="text-first text-bold text-2xl">Comments</span> {/* Title color changed to white */}
                        </div>

                        {/* List of Comments */}
                        <div className="space-y-4">
                            <div
                                style={{
                                    display: 'flex',              // Align items horizontally
                                    flexWrap: 'nowrap',           // Prevent wrapping of items
                                    overflowX: 'auto',            // Enable horizontal scrolling
                                    whiteSpace: 'nowrap',         // Prevent items from breaking into multiple lines
                                    paddingBottom: '10px',        // Optional, for better scroll visibility
                                }}
                            >
                                <List
                                    itemLayout="horizontal"
                                    dataSource={activity?.comments}
                                    renderItem={(comment) => (
                                        <List.Item
                                            className="transition-all duration-300 hover:bg-[#4A90E2] hover:text-white rounded-xl"
                                            style={{
                                                marginRight: '16px',  // Space between items
                                                display: 'inline-flex', // Ensure items are displayed inline with their natural width
                                                flexShrink: 0,         // Prevent shrinking of list items
                                                minWidth: '200px',      // Ensure the item takes only the space it needs
                                            }}
                                        >
                                            <List.Item.Meta
                                                className="pl-3"
                                                avatar={<Avatar icon={<UserOutlined />} />}
                                                title={
                                                    <span className="text-black">
                                        {/* {comment.createdBy.username} */}
                                    </span>
                                                }
                                                description={
                                                    <Space>
                                                        <Text className="text-black">
                                                            {comment?.comment}
                                                        </Text>
                                                    </Space>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                    style={{
                                        padding: 0,  // Remove any extra padding applied to the List itself
                                    }}
                                />
                            </div>
                        </div>
                    </Card>
                )}
                
                <Row justify="center" align="middle" gutter={[16, 16]}>
  {/* Activity Information Card */}
  <Col xs={25} sm={22} md={16} style={{ padding: '0' }}>
    <Card
      size="small"
      style={{
        borderColor: 'black',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '15px',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        backgroundColor: "#94A3B8",
        height: 'auto',
        maxHeight: '250px',
        width: '70%', // Reduced width for a less wide card
        margin: '0 auto', // Centering the card horizontally
        marginLeft: '-6%', // Shifting the card slightly to the left
      }}
      onMouseEnter={() => setHoveredCard("footer")}
      onMouseLeave={() => setHoveredCard(null)}
      className="text-center mx-auto"
    >
      <div className="space-y-4">
        {/* Footer Title and Icon */}
        <div className="text-xl font-bold text-white mb-4">
          <EnvironmentOutlined size={20} className="text-fourth" />
          <span className="ml-2">Activity Information</span>
        </div>

        {/* Info Section with Flexbox for larger screens */}
        <Space
          direction="vertical"
          size="small"
          style={{ textAlign: 'center' }}
          className="mt-6 flex justify-center sm:flex sm:flex-row sm:space-x-6 sm:text-left sm:items-center sm:space-y-0"
        >
          <Text type="secondary" style={{ color: "black" }} className="flex items-center">
            <UserOutlined className="mr-2 text-fourth " />
            <strong>Created by:</strong> {activity?.createdBy?.username}
          </Text>
          <Text type="secondary" style={{ color: "black" }} className="flex items-center">
            <CalendarOutlined className="mr-2 text-fourth" />
            <strong>Created at:</strong> {new Date(activity?.createdAt).toLocaleDateString()}
          </Text>
          <Text type="secondary" style={{ color: "black" }} className="flex items-center">
            <ClockCircleOutlined className="mr-2 text-fourth" />
            <strong>Last updated:</strong> {new Date(activity?.updatedAt).toLocaleDateString()}
          </Text>
        </Space>
      </div>

      {/* Footer Action Links */}
      <div className="mt-2 flex justify-center space-x-6">
        <a
          href="#"
          className="text-white text-lg font-medium hover:text-blue-500 hover:underline transition-all duration-300"
        >
          Privacy Policy
        </a>
        <a
          href="#"
          className="text-white text-lg font-medium hover:text-blue-500 hover:underline transition-all duration-300"
        >
          Terms of Service
        </a>
      </div>

      {/* Footer Footer */}
      <div className="mt-0 text-sm text-gray-400">
        <Text>© 2024 Teer Enta. All rights reserved.</Text>
      </div>
    </Card>
  </Col>

  {/* Book Now Button */}
  <Col xs={24} sm={24} md={8} style={{ padding: '0', marginLeft: '-10%' }}>
  <Button
    onClick={() => handleActivityBooking(ActivityId)}
    className="text-white bg-second hover:bg-third transition-all duration-200"
    style={{
      fontSize: '60px', // Bigger font for the button
      padding: '50px 70px', // Larger button padding
      width: '100%', // Full width of the container
      backgroundColor: "#1a2b49",
    }}
  >
    Book Now
  </Button>
</Col>

</Row>


          </Space>
        </div>
      );
      
};

export default ActivityDetails;
