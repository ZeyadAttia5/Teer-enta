import React, {useEffect, useState} from "react";
import {MapPin, Clock, Calendar} from 'lucide-react';

import {
    Card,
    Typography,
    Tag,
    Space,
    List,
    Rate,
    Timeline,
    Avatar,
    Row,
    Col,
    message,
    Button,
} from "antd";
import {
    ArrowRightOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    GlobalOutlined,
    CalendarOutlined,
    UserOutlined,
    CheckCircleOutlined,
    CopyOutlined,
    MailOutlined,
} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router-dom";
import {getIternary} from "../../api/itinerary.ts";
import {TItinerary} from "../../types/Itinerary/Itinerary";
import {getCommentsForTourGuide} from "../../api/tourGuide.ts";

const {Title, Text} = Typography;

const ItineraryDetails: React.FC = () => {
    const {id: itineraryId} = useParams<{ id: string }>();
    const [itinerary, setItinerary] = useState<TItinerary>();
    const [tourGuide,setTourGuide] = useState();
    const navigate = useNavigate();
    const [tourGuideComments, setTourGuideComments] = useState([]);

    const cardStyle = "bg-white shadow-xl rounded-lg w-full h-full overflow-hidden";
    const gradientBg = "bg-slate-400";
    const titleStyle = "text-lg font-semibold mb-4 flex items-center gap-2 text-white";

    useEffect(() => {
        getIternary(itineraryId)
            .then((res) => {
                setItinerary(res.data.itinerary);
                setTourGuide(res.data.tourGuide);
                fetchTourGuideComments(res.data.itinerary.createdBy);
            })
            .catch((error) => {
                message.error("Failed to fetch itinerary details");
            });

    }, [itineraryId]);

    const fetchTourGuideComments = async (tourGuideId) => {
        try {
            console.log(tourGuideId);
            const response = await getCommentsForTourGuide(tourGuideId);
            setTourGuideComments(response.data.comments);
        } catch (error) {
            message.error("Failed to fetch tour guide comments");
        }
    }

    const averageRating = React.useMemo(() => {
        if (itinerary?.ratings.length === 0) return 0;
        return Number(
            (
                (itinerary?.ratings ?? []).reduce((acc, curr) => acc + curr.rating, 0) /
                (itinerary?.ratings?.length || 1)
            ).toFixed(1)
        );
    }, [itinerary?.ratings]);

    // Copy Link function
    const handleCopyLink = () => {
        const url = `${window.location.origin}/itinerary/iternaryDetails/${itineraryId}`;
        navigator.clipboard.writeText(url).then(
            () => message.success("Link copied to clipboard!"),
            () => message.error("Failed to copy link")
        );
    };

    // Share via Email function
    const handleShareEmail = () => {
        const subject = `Check out this itinerary: ${itinerary?.name}`;
        const body = `
    Itinerary Details:
    - Name: ${itinerary?.name}
    - Language: ${itinerary?.language}
    - Price: $${itinerary?.price}
    - Active: ${itinerary?.isActive ? "Yes" : "No"}
    - Pickup Location: ${itinerary?.pickupLocation || "N/A"}
    - Drop-off Location: ${itinerary?.dropOffLocation || "N/A"}
    - Available Dates: ${
            itinerary?.availableDates
                .map((date) => `${new Date(date.Date).toLocaleDateString()} at ${date.Times}`)
                .join(", ") || "No dates available"
        }
    - Accessibility: ${itinerary?.accessibility || "Not specified"}

    Activities:
    ${itinerary?.activities
            .map(
                (activity, index) =>
                    `  ${index + 1}. ${activity.activity.name} - ${activity.duration} mins`
            )
            .join("\n") || "No activities listed"}

    Ratings: ${itinerary?.ratings?.length} ratings
    Average Rating: ${
            itinerary?.ratings?.length
                ? (
                    itinerary.ratings?.reduce((sum, r) => sum + r.rating, 0) /
                    itinerary.ratings?.length
                ).toFixed(1)
                : "No ratings yet"
        }

    Check out more details and book here: ${window.location.origin}/itinerary/iternaryDetails/${itineraryId}
  `;

        const mailtoLink = `mailto:?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };

  return (
  <div className="bg-slate-50 min-h-screen flex items-center justify-center p-8">
            <Space direction="vertical" size="large" className="relative w-full p-10">
                <div className="absolute top-1 left-1/2 animate-bounce">
                    <EnvironmentOutlined className="text-6xl text-black"/>
                </div>

                {/* First Card for Itinerary Details */}
                <Card
                    bordered={true}  // Add border to the card
                    className={`${cardStyle} ${gradientBg} w-full border-third max-w-4xl mx-auto`}
                    bodyStyle={{height: '100%'}}
                >
                    <div className={titleStyle}>
                        <EnvironmentOutlined size={20}/>
                        <span>Itinerary</span>
                    </div>
                    <div className="space-y-4">
                        {/* Itinerary Name */}
                        <Row justify="center" className="text-center mb-0">
                            <Title level={2} className="font-extrabold text-black-300 !text-black-300 mb-0 " style={{ fontSize: '7rem', marginBottom: '0.15rem' }}>
                                {itinerary?.name}
                            </Title>

                        </Row>

                        {/* Description */}
                        <Row justify="center" className="text-center">
                            <p className="text-black text-lg font-medium mb-4"style={{ fontSize: '2rem' }}>
                                {"Explore amazing travel experiences!"}
                            </p>
                        </Row>
                        <Row justify="center" align="middle" className="text-center space-x-2">
                {itinerary?.pickupLocation && (
                    <Col>
                        <Text className="text-black font-semibold text-2xl">{itinerary?.pickupLocation}</Text>
                    </Col>
                )}

                {/* Arrow between the locations */}
                <Col className="flex items-center">
                    <ArrowRightOutlined className="text-black text-1xl" />
                </Col>

                {itinerary?.dropOffLocation && (
                    <Col>
                        <Text className="text-black font-semibold text-2xl">{itinerary?.dropOffLocation}</Text>
                    </Col>
                )}
            </Row>

                        {/* Tags */}
                        <Row justify="space-between" align="middle" gutter={[16, 16]}>
                            <Col>
                                <Space size="small">
                                    <Tag icon={<GlobalOutlined/>} color="magenta" className="text-white">
                                        {itinerary?.language}
                                    </Tag>
                                    <Tag icon={<DollarOutlined/>} color="green" className="text-white">
                                        ${itinerary?.price}
                                    </Tag>
                                    {itinerary?.isActive && (
                                        <Tag icon={<CheckCircleOutlined/>} color="success" className="text-white">
                                            Active
                                        </Tag>
                                    )}
                                </Space>
                            </Col>

                            {/* Rating and Actions */}
<Col>
  <Space direction="vertical" align="center">
    <Rate disabled value={averageRating} allowHalf />
    <Text type="secondary" className="text-white">
      {itinerary?.ratings.length} ratings
    </Text>
    <Space>
  {/* Copy Link Button with Icon and Text on Hover */}
  <Button
    icon={<CopyOutlined />}
    onClick={handleCopyLink}
    className="text-black bg-white hover:bg-gray-200 relative group"
  >
    {/* Invisible text, visible on hover */}
    <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 text-sm bg-white text-black px-2 py--3 rounded">
      Copy Link
    </span>
  </Button>

  {/* Send Mail Button with Icon and Text on Hover */}
  <Button
    icon={<MailOutlined />}
    onClick={handleShareEmail}
    className="text-black bg-white hover:bg-gray-200 relative group"
  >
    {/* Invisible text, visible on hover */}
    <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 text-sm bg-white text-black px-2 py-0 rounded">
      Send Mail
    </span>
  </Button>
</Space>

  </Space>
</Col>

                        </Row>
                    </div>
                </Card>


                {/* Combined Row for Locations, Activities, Timeline, and Available Dates */}
                <Row gutter={[16, 16]} className="mb-8" justify="center" align="middle">
    
    {/* Activities Card */}
    <Col xs={24} sm={12} md={6} className="flex justify-center ">
        <Card
            className={`${cardStyle} ${gradientBg} bg-third transform transition-all duration-300 ease-in-out  `}
            bodyStyle={{ height: '100%', padding: '24px 24px 0' }}
        >
            <div className="flex items-center justify-center text-black mb-4 ">
                <Clock size={20} className="mr-2" />
                <span className="font-bold text-xl">Activities</span>
            </div>
            <List
                dataSource={itinerary?.activities}
                renderItem={(item) => (
                    <List.Item
                        className="cursor-pointer rounded-md px-2 py-1 mb-2 bg-white/10 hover:bg-white/20 transition-all duration-300"
                        onClick={() => navigate(`../activityDetails/${item.activity?._id}`)}
                    >
                        <Text className="text-black text-sm pl-3">{item.activity?.name}</Text>
                        <Tag className="bg-blue-500 text-white border-none">{item.duration} min</Tag>
                    </List.Item>
                )}
            />
        </Card>
    </Col>

    {/* Timeline Card */}
    <Col xs={24} sm={12} md={6} className="flex justify-center">
        <Card
            className={`${cardStyle} ${gradientBg} transform transition-all duration-300 ease-in-out hover:scale-105`}
            bodyStyle={{ height: '100%' }}
        >
            <div className="flex items-center justify-center text-black mb-4">
                <Clock size={20} className="mr-2" />
                <span className="font-bold text-xl">Timeline</span>
            </div>
            <Timeline
                items={itinerary?.timeline.map((item, index) => ({
                    color: 'blue',
                    children: (
                        <>
                            <Text strong className="text-black">{item.activity?.name}</Text>
                            {item.startTime && (
                                <Text className="text-black/80 block"> Starts at {item.startTime}</Text>
                            )}
                            {item.duration && <Tag className="bg-blue-500 text-white border-none mt-1">{item.duration} min</Tag>}
                        </>
                    ),
                }))}
            />
        </Card>
    </Col>

    {/* Available Dates Card */}
    <Col xs={24} sm={12} md={6} className="flex justify-center">
        <Card
            className={`${cardStyle} ${gradientBg} transform transition-all duration-300 ease-in-out hover:scale-105`}
            bodyStyle={{ height: '100%', padding: '24px 24px 0' }}
        >
            <div className="flex items-center justify-center text-black mb-4">
                <Calendar size={20} className="mr-2" />
                <span className="font-bold text-xl">Available Dates</span>
            </div>
            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={itinerary?.availableDates}
                renderItem={(date) => (
                    <List.Item>
                        <Card size="small" className="bg-white/10 shadow-sm rounded-lg mb-2 hover:bg-white/20 transition-all duration-300">
                            <Space className="justify-between w-full">
                                <Text className="text-black">{new Date(date.Date).toLocaleDateString()}</Text>
                                <Tag className="bg-cyan-500 text-white border-none">{date.Times}</Tag>
                            </Space>
                        </Card>
                    </List.Item>
                )}
            />
        </Card>
    </Col>
</Row>


                {/* Last Full-Width Card for Comments */}
                {(itinerary?.comments.length ?? 0) > 0 && (
                    <Card
                        bordered={true}  // Add border to the card
                        className={`${cardStyle} ${gradientBg} w-full border-white`} // Gradient background and white border
                        bodyStyle={{ height: '100%' }}
                    >
                        <div className={titleStyle}>
                            <UserOutlined className="text-[#4A90E2]" /> {/* Icon color adjusted */}
                            <span className="text-black">Comments</span> {/* Title color changed to white */}
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
                                    dataSource={itinerary?.comments}
                                    renderItem={(comment) => (
                                        <List.Item
                                            className="transition-all duration-300 hover:bg-[#4A90E2] hover:text-black rounded-xl"
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
                                                    <span className="text-gray-300 hover:text-black">
                                        {comment.createdBy.username}
                                    </span>
                                                }
                                                description={
                                                    <Space>
                                                        <Text className="text-black hover:text-white">
                                                            {comment.comment}
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

                {(tourGuideComments?.length ?? 0) > 0 && (
                    <Card
                        bordered={true}  // Add border to the card
                        className={`${cardStyle} ${gradientBg} w-full border-white`} // Gradient background and white border
                        bodyStyle={{ height: '100%' }}
                    >
                        <div className={titleStyle}>
                            <UserOutlined className="text-[#4A90E2]" /> {/* Icon color adjusted */}
                            <span className="text-black">Tour Guide Reviews</span> {/* Title color changed to white */}
                        </div>

                        {/* List of Tour Guide Comments */}
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
                                    dataSource={tourGuideComments}
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
                                                    <span className="text-gray-300 hover:text-black">
                                        {comment.createdBy.username}
                                    </span>
                                                }
                                                description={
                                                    <Space>
                                                        <Text className="text-black hover:text-white">
                                                            {comment.comment}
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






                <Card className={`text-center ${cardStyle} ${gradientBg} rounded-lg shadow-lg mt-8 p-6`}>
                    <div className="space-y-4">
                        {/* Footer Title and Icon */}
                        <div className="text-xl font-bold text-black mb-4">
                            <EnvironmentOutlined size={20} className=" text-blue-500"/>
                            <span className="ml-2">Itinerary Information</span>
                        </div>

                        {/* Footer Information */}
                        <Space direction="vertical" size="small" className="text-center">
                            <Text type="secondary" className="text-blue-500">
                                <UserOutlined className="mr-2 text-blue-500"/>
                                <strong>Created by: </strong> {tourGuide}
                            </Text>
                            <Text type="secondary" className="text-blue-500">
                                <CalendarOutlined className="mr-2 text-blue-500"/>
                                <strong>Created: </strong> {new Date(itinerary?.createdAt ?? "").toLocaleDateString()}
                            </Text>
                            <Text type="secondary" className="text-blue-500">
                                <ClockCircleOutlined className="mr-2 text-blue-500"/>
                                <strong>Last
                                    Updated: </strong> {new Date(itinerary?.updatedAt ?? "").toLocaleDateString()}
                            </Text>
                        </Space>
                    </div>

                    {/* Footer Action Links */}
                    <div className="mt-6 flex justify-center space-x-6">
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
                    <div className="mt-8 text-sm text-gray-400">
                        <Text>© 2024 Teer Enta. All rights reserved.</Text>
                    </div>
                </Card>

            </Space>
        </div>
    );
};
export default ItineraryDetails;

