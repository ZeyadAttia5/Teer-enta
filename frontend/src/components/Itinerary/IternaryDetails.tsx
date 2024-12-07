import React, {useEffect, useState} from "react";
import {MapPin, Clock, Calendar} from "lucide-react";

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
    Tabs, Spin,
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
    TrophyOutlined, StarOutlined, MessageOutlined, TagOutlined, InfoCircleOutlined, HeartOutlined,
} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router-dom";
import {getIternary} from "../../api/itinerary.ts";
import {TItinerary} from "../../types/Itinerary/Itinerary";
import {getCommentsForTourGuide, getRatingsForTourGuide} from "../../api/tourGuide.ts";
import BackButton from "../shared/BackButton/BackButton.js";
import {getMyCurrency} from "../../api/profile.ts";
import TabPane from "antd/es/tabs/TabPane";

const {Title, Text} = Typography;

const ItineraryDetails: React.FC = () => {
    const {id: itineraryId} = useParams<{ id: string }>();
    const [itinerary, setItinerary] = useState<TItinerary>();
    const [tourGuide, setTourGuide] = useState();
    const navigate = useNavigate();
    const [tourGuideComments, setTourGuideComments] = useState([]);
    const [tourGuideRatings, setTourGuideRatings] = useState([]);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [currency, setCurrency] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const [activeTab, setActiveTab] = useState('1');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await getIternary(itineraryId);
                console.log(response.data);
                setItinerary(response.data.itinerary);
                setTourGuide(response.data.tourGuide);
                fetchTourGuideComments(response.data.itinerary.createdBy);
                fetchTourGuideRatings(response.data.itinerary.createdBy);
                const response2 = await getMyCurrency();
                setCurrency(response2.data);
                setLoading(false);
            } catch (error) {
                message.error("Failed to fetch itinerary details");
            }
        };

        fetchInitialData();
    }, [itineraryId, user?._id]);

    const fetchTourGuideComments = async (tourGuideId) => {
        try {
            // console.log(tourGuideId);
            const response = await getCommentsForTourGuide(tourGuideId);
            setTourGuideComments(response.data.comments);
        } catch (error) {
            message.error("Failed to fetch tour guide comments");
        }
    };

    const fetchTourGuideRatings = async (tourGuideId) => {
        try {
            // console.log(tourGuideId);
            const response = await getRatingsForTourGuide(tourGuideId);
            console.log(response.ratings);
            setTourGuideRatings(response.ratings);
        } catch (error) {
            message.error("Failed to fetch tour guide ratings");
        }
    }
    const calculateAverageRating = () => {
        if (!itinerary?.ratings?.length) return 0;
        const sum = itinerary.ratings.reduce((sum, r) => sum + r.rating, 0) / itinerary.ratings.length;
        return Number(sum.toFixed(1));
    };
    const calculateTourGuideRating = () => {
        if (!tourGuideRatings?.length) return 0;
        const sum = tourGuideRatings.reduce((acc, curr) => acc + curr.rating, 0);
        return sum / tourGuideRatings.length;
    };
    const averageRating = calculateAverageRating();
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
                .map(
                    (date) =>
                        `${new Date(date.Date).toLocaleDateString()} at ${date.Times}`
                )
                .join(", ") || "No dates available"
        }
    - Accessibility: ${itinerary?.accessibility || "Not specified"}

    Activities:
    ${
            itinerary?.activities
                .map(
                    (activity, index) =>
                        `  ${index + 1}. ${activity.activity.name} - ${
                            activity.duration
                        } mins`
                )
                .join("\n") || "No activities listed"
        }

    Ratings: ${itinerary?.ratings?.length} ratings
    Average Rating: ${
            itinerary?.ratings?.length
                ? (
                    itinerary.ratings?.reduce((sum, r) => sum + r.rating, 0) /
                    itinerary.ratings?.length
                ).toFixed(1)
                : "No ratings yet"
        }

    Check out more details and book here: ${
            window.location.origin
        }/itinerary/iternaryDetails/${itineraryId}
  `;

        const mailtoLink = `mailto:?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };

    const handleBookItinerary = (ItineraryId) => {
        window.location.href = `${window.location.origin}/itinerary/book/${ItineraryId}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large"/>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Hero Section */}
            <div className="relative h-[400px] overflow-hidden">
                <img
                    src={itinerary.imageUrl || ''}
                    alt={itinerary.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"/>

                {/* Share Actions */}
                <div className="absolute top-6 right-6 flex gap-2">
                    <Button
                        icon={<CopyOutlined/>}
                        onClick={handleCopyLink}
                        className="bg-white/90 hover:bg-white border-none"
                    />
                    <Button
                        icon={<MailOutlined/>}
                        onClick={handleShareEmail}
                        className="bg-white/90 hover:bg-white border-none"
                    />
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="space-y-4">
                            <Title level={1} className="text-white m-0 text-4xl md:text-5xl font-bold">
                                {itinerary.name}
                            </Title>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                                    <GlobalOutlined/>
                                    <span>{itinerary.language}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                                    <DollarOutlined/>
                                    <span>{currency.code} {(itinerary.price * currency.rate).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                                    <StarOutlined/>
                                    <Rate disabled value={averageRating} allowHalf className="text-sm"/>
                                    <span>({itinerary.ratings?.length || 0} reviews)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Row gutter={[24, 24]}>
                    <Col xs={24}>
                        {/* Booking Card */}
                        <Card className="mb-6 bg-gradient-to-br from-gray-50 to-white">
                            <div className="flex flex-wrap justify-between items-center gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Text className="text-xl font-semibold">{itinerary.pickupLocation}</Text>
                                        <span className="text-gray-400">→</span>
                                        <Text className="text-xl font-semibold">{itinerary.dropOffLocation}</Text>
                                    </div>
                                    <div className="flex gap-2">
                                        {itinerary.isActive && (
                                            <Tag color="success">Active</Tag>
                                        )}
                                        {itinerary.isBookingOpen && (
                                            <Tag color="processing">Booking Open</Tag>
                                        )}
                                    </div>
                                </div>
                                {user?.userRole === "Tourist" && (
                                    <Button
                                        type={itinerary.isBookingOpen ? "danger" : "default"}
                                        onClick={() => handleBookItinerary(itinerary._id)}
                                        className={`px-12 h-14 text-lg rounded-lg font-semibold ${
                                            itinerary.isBookingOpen
                                                ? 'bg-[#2A3663] hover:bg-black text-white'
                                                : 'bg-gray-100 text-gray-500 cursor-not-allowed hover:bg-gray-100'
                                        }`}
                                        disabled={!itinerary.isBookingOpen}
                                    >
                                        {itinerary.isBookingOpen ? "Book Now" : "Not Available"}
                                    </Button>
                                )}
                            </div>
                        </Card>
                        {/* About Section - Added before Footer */}
                        <Card className="mt-8 bg-gradient-to-br from-gray-50 to-white">
                            <Title level={4} className="m-0 flex items-center gap-2 text-blue-600 mb-6">
                                <InfoCircleOutlined />
                                About This Itinerary
                            </Title>

                            <div className="space-y-6">
                                <div>
                                    <Text className="text-gray-500 block mb-3">Categories & Tags</Text>
                                    <div className="flex flex-wrap gap-2">
                                        {itinerary.preferenceTags?.map((tag, index) => (
                                            <Tag key={index} color="green" className="px-4 py-1 text-sm">
                                                {tag.tag}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-100 pt-6">
                                    <div className="flex items-center gap-3">
                                        <UserOutlined className="text-blue-600"/>
                                        <div>
                                            <Text className="text-gray-500 block text-sm">Created By</Text>
                                            <Text className="text-gray-800 font-medium">
                                                {tourGuide}
                                            </Text>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CalendarOutlined className="text-blue-600"/>
                                        <div>
                                            <Text className="text-gray-500 block text-sm">Created On</Text>
                                            <Text className="text-gray-800 font-medium">
                                                {new Date(itinerary?.createdAt).toLocaleDateString()}
                                            </Text>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ClockCircleOutlined className="text-blue-600"/>
                                        <div>
                                            <Text className="text-gray-500 block text-sm">Last Updated</Text>
                                            <Text className="text-gray-800 font-medium">
                                                {new Date(itinerary?.updatedAt).toLocaleDateString()}
                                            </Text>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Text className="text-gray-500 block mb-2">Duration</Text>
                                            <Text className="text-gray-800 flex items-center gap-2">
                                                <ClockCircleOutlined/>
                                                {itinerary.timeline.reduce((acc, curr) => acc + curr.duration, 0)} minutes
                                            </Text>
                                        </div>
                                        <div>
                                            <Text className="text-gray-500 block mb-2">Language</Text>
                                            <Text className="text-gray-800 flex items-center gap-2">
                                                <GlobalOutlined/> {itinerary.language}
                                            </Text>
                                        </div>
                                    </div>
                                </div>

                                {itinerary.additionalInfo && (
                                    <div className="border-t border-gray-100 pt-6">
                                        <Text className="text-gray-500 block mb-2">Additional Information</Text>
                                        <Text className="text-gray-800">
                                            {itinerary.additionalInfo}
                                        </Text>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Activities & Timeline Combined */}
                        <Card className="mt-8 bg-gradient-to-br from-gray-50 to-white">
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="h-7 w-7 text-blue-950"/>
                                <Title level={4} className="m-0">Timeline & Activities</Title>
                            </div>

                            <Tabs
                                defaultActiveKey="1"
                                className="activity-timeline-tabs"
                                items={[
                                    {
                                        key: '1',
                                        label: 'Timeline View',
                                        children: (
                                            <Timeline className="p-4">
                                                {itinerary.timeline.map((item, index) => (
                                                    <Timeline.Item
                                                        key={index}
                                                        dot={<Clock className="h-5 w-5 text-blue-950"/>}
                                                        className="p-4 rounded-xl transition-all duration-300"
                                                    >
                                                        <div className="bg-white rounded-lg p-4">
                                                            <div className="flex gap-4">
                                                                <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                                                                    <img
                                                                        src="/api/placeholder/96/96"
                                                                        alt={item.activity?.name || 'Activity'}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex-grow">
                                                                    <Text strong className="text-lg block text-gray-800 mb-2">
                                                                        {item.activity?.name || 'Unnamed Activity'}
                                                                    </Text>
                                                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                                                        <Tag color="blue" className="px-3 py-1 text-sm">
                                                                            <ClockCircleOutlined className="mr-1"/> {item.duration} min
                                                                        </Tag>
                                                                        <Tag color="green" className="px-3 py-1 text-sm">
                                                                            <CalendarOutlined className="mr-1"/> {item.startTime}
                                                                        </Tag>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Timeline.Item>
                                                ))}
                                            </Timeline>
                                        ),
                                    },
                                    {
                                        key: '2',
                                        label: 'List View',
                                        children: (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                                {itinerary.activities.map((item, index) => (
                                                    <div key={index} className="bg-white rounded-xl overflow-hidden">
                                                        <div className="h-40 overflow-hidden">
                                                            <img
                                                                src="/api/placeholder/400/160"
                                                                alt={item.activity?.name || 'Activity'}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="p-4">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <Text strong className="text-lg text-gray-800">
                                                                    {item.activity?.name || 'Unnamed Activity'}
                                                                </Text>
                                                                <Button
                                                                    type="text"
                                                                    icon={<ArrowRightOutlined/>}
                                                                    className="text-blue-500 hover:text-blue-600"
                                                                    onClick={() => navigate(`/itinerary/activityDetails/${item.activity?._id}`)}
                                                                />
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mb-2">
                                                                <Tag color="blue" className="flex items-center">
                                                                    <ClockCircleOutlined className="mr-1"/> {item.duration} min
                                                                </Tag>
                                                                {item.activity?.category && typeof item.activity.category === 'string' && (
                                                                    <Tag color="purple" className="flex items-center">
                                                                        <TagOutlined className="mr-1"/> {item.activity.category}
                                                                    </Tag>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ),
                                    },
                                ]}
                            />

                            <style jsx>{`
                                .activity-timeline-tabs .ant-tabs-nav::before {
                                    display: none;
                                }

                                .activity-timeline-tabs .ant-tabs-tab {
                                    padding: 8px 16px;
                                    margin: 0 8px 0 0;
                                    background: white;
                                    border-radius: 8px;
                                    transition: all 0.3s;
                                }

                                .activity-timeline-tabs .ant-tabs-tab:hover {
                                    background: #f3f4f6;
                                }

                                .activity-timeline-tabs .ant-tabs-tab-active {
                                    background: #e5e7eb !important;
                                }

                                .activity-timeline-tabs .ant-tabs-content {
                                    background: #f9fafb;
                                    border-radius: 12px;
                                    margin-top: 16px;
                                    color: rgba(0, 0, 54, 0.68);
                                }

                                .line-clamp-2 {
                                    display: -webkit-box;
                                    -webkit-line-clamp: 2;
                                    -webkit-box-orient: vertical;
                                    overflow: hidden;
                                }
                            `}</style>
                        </Card>

                        {/* Available Dates */}
                        <Card className="mt-8 bg-gradient-to-br from-gray-50 to-white">
                            <Title level={4} className="mb-6 flex items-center gap-2">
                                <CalendarOutlined/>
                                Available Dates
                            </Title>
                            <List
                                grid={{gutter: 16, column: 4}}
                                dataSource={itinerary.availableDates}
                                renderItem={(date) => (
                                    <List.Item>
                                        <Card>
                                            <Text strong>{new Date(date.Date).toLocaleDateString()}</Text>
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        </Card>

                        {/* Reviews and Comments Section */}
                        <Card className="mt-8  bg-gradient-to-br from-gray-50 to-white">
                            <Tabs
                                activeKey={activeTab}
                                onChange={setActiveTab}
                                className="fancy-tabs"
                                items={[
                                    {
                                        key: '1',
                                        label: (
                                            <span className="flex items-center gap-2 px-3 py-2">
                                            <StarOutlined className="text-blue-500"/>
                                            <span className="font-medium">Itinerary Ratings</span>
                                        </span>
                                        ),
                                        children: (
                                            <>
                                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-4">
                                                    <div className="text-center">
                                                        <Text className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                                            {averageRating}
                                                        </Text>
                                                        <div className="my-3">
                                                            <Rate disabled value={Number(averageRating)} allowHalf className="text-yellow-400"/>
                                                        </div>
                                                        <Text className="text-gray-600">
                                                            Based on {itinerary.ratings?.length || 0} reviews
                                                        </Text>
                                                    </div>
                                                </div>
                                                <List
                                                    itemLayout="horizontal"
                                                    dataSource={itinerary.ratings}
                                                    renderItem={(rating) => (
                                                        <List.Item className="rounded-xl p-4 mb-2">
                                                            {console.log(itinerary.ratings)}
                                                            <List.Item.Meta
                                                                avatar={
                                                                    <div className="relative">
                                                                        <Avatar icon={<UserOutlined/>} className="bg-gradient-to-r from-blue-500 to-indigo-500"/>
                                                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                                                                        </div>
                                                                    </div>
                                                                }
                                                                title={
                                                                    <div className="flex justify-between items-center">
                                                                        <Text strong
                                                                              className="text-gray-800">{rating.createdBy?.username}</Text>
                                                                        <div className="flex items-center gap-2">
                                                                            <Rate disabled defaultValue={rating.rating}
                                                                                  className="text-sm"/>
                                                                            <Text
                                                                                className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                                                                {new Date(rating.createdAt).toLocaleDateString()}
                                                                            </Text>
                                                                        </div>
                                                                    </div>
                                                                }
                                                            />
                                                        </List.Item>
                                                    )}
                                                />
                                            </>
                                        )
                                    },
                                    {
                                        key: '2',
                                        label: (
                                            <span className="flex items-center gap-2 px-3 py-2">
                                            <MessageOutlined className="text-emerald-500"/>
                                            <span className="font-medium">Itinerary Comments</span>
                                        </span>
                                        ),
                                        children: (
                                            <List
                                                itemLayout="horizontal"
                                                dataSource={itinerary.comments}
                                                renderItem={(comment) => (
                                                    <List.Item className="rounded-xl p-4 mb-2">
                                                        <List.Item.Meta
                                                            avatar={
                                                                <Avatar
                                                                    icon={<UserOutlined/>}
                                                                    className="bg-gradient-to-r from-emerald-500 to-green-500"
                                                                />
                                                            }
                                                            title={
                                                                <div className="flex justify-between items-center">
                                                                    <Text strong className="text-gray-800">{comment.createdBy?.username}</Text>
                                                                    <Text className="text-xs bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full">
                                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                                    </Text>
                                                                </div>
                                                            }
                                                            description={
                                                                <div className="mt-2 bg-white p-3 rounded-lg">
                                                                    <Text className="text-gray-600">{comment.comment}</Text>
                                                                </div>
                                                            }
                                                        />
                                                    </List.Item>
                                                )}
                                            />
                                        )
                                    },
                                    {
                                        key: '3',
                                        label: (
                                            <span className="flex items-center gap-2 px-3 py-2">
                                            <StarOutlined className="text-purple-500"/>
                                            <span className="font-medium">Tour Guide Ratings</span>
                                        </span>
                                        ),
                                        children: (
                                            <>
                                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-4">
                                                    <div className="text-center">
                                                        <Text className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                                            {calculateTourGuideRating().toFixed(1)}
                                                        </Text>
                                                        <div className="my-3">
                                                            <Rate disabled value={calculateTourGuideRating()} allowHalf className="text-purple-400"/>
                                                        </div>
                                                        <Text className="text-gray-600">
                                                            Based on {tourGuideRatings?.length || 0} ratings
                                                        </Text>
                                                    </div>
                                                </div>
                                                <List
                                                    itemLayout="horizontal"
                                                    dataSource={tourGuideRatings || []}
                                                    renderItem={(rating) => (
                                                        <List.Item className="rounded-xl p-4 mb-2">
                                                            <List.Item.Meta
                                                                avatar={
                                                                    <div className="relative">
                                                                        <Avatar icon={<UserOutlined/>} className="bg-gradient-to-r from-purple-500 to-pink-500"/>
                                                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                                                                            {/*<StarOutlined className="text-purple-400 text-xs"/>*/}
                                                                        </div>
                                                                    </div>
                                                                }
                                                                title={
                                                                    <div className="flex justify-between items-center">
                                                                        <Text strong className="text-gray-800">{rating.createdBy?.username}</Text>
                                                                        <div className="flex items-center gap-2">
                                                                            <Rate disabled defaultValue={rating.rating} className="text-sm"/>
                                                                            <Text className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                                                                                {new Date(rating.createdAt).toLocaleDateString()}
                                                                            </Text>
                                                                        </div>
                                                                    </div>
                                                                }
                                                            />
                                                        </List.Item>
                                                    )}
                                                    locale={{
                                                        emptyText: (
                                                            <div className="text-center py-8">
                                                                <StarOutlined className="text-4xl text-gray-300 mb-2"/>
                                                                <Text className="block text-gray-400">No ratings yet</Text>
                                                            </div>
                                                        )
                                                    }}
                                                />
                                            </>
                                        )
                                    },
                                    {
                                        key: '4',
                                        label: (
                                            <span className="flex items-center gap-2 px-3 py-2">
                                            <MessageOutlined className="text-pink-500"/>
                                            <span className="font-medium">Tour Guide Comments</span>
                                        </span>
                                        ),
                                        children: (
                                            <List
                                                itemLayout="horizontal"
                                                dataSource={tourGuideComments}
                                                renderItem={(comment) => (
                                                    <List.Item className="rounded-xl p-4 mb-2">
                                                        <List.Item.Meta
                                                            avatar={
                                                                <Avatar
                                                                    icon={<UserOutlined/>}
                                                                    className="bg-gradient-to-r from-pink-500 to-rose-500"
                                                                />
                                                            }
                                                            title={
                                                                <div className="flex justify-between items-center">
                                                                    <Text strong className="text-gray-800">{comment.createdBy?.username}</Text>
                                                                    <Text className="text-xs bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
                                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                                    </Text>
                                                                </div>
                                                            }
                                                            description={
                                                                <div className="mt-2 bg-white p-3 rounded-lg">
                                                                    <Text className="text-gray-600">{comment.comment}</Text>
                                                                </div>
                                                            }
                                                        />
                                                    </List.Item>
                                                )}
                                            />
                                        )
                                    }
                                ]}
                            />

                            <style jsx>{`
                            .fancy-tabs .ant-tabs-nav {
                                margin-bottom: 1rem;
                                background: #f8fafc;
                                padding: 0.5rem;
                                border-radius: 0.75rem;
                            }

                            .fancy-tabs .ant-tabs-tab {
                                margin: 0 !important;
                                padding: 0.5rem !important;
                                border-radius: 0.5rem;
                                transition: all 0.3s;
                            }

                            .fancy-tabs .ant-tabs-tab:hover {
                                background: white;
                            }

                            .fancy-tabs .ant-tabs-tab-active {
                                background: white !important;
                                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
                            }

                            .fancy-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
                                color: #4f46e5 !important;
                            }

                            .fancy-tabs .ant-tabs-ink-bar {
                                display: none;
                            }

                            .activity-timeline-tabs .ant-tabs-nav::before {
                                display: none;
                            }

                            .activity-timeline-tabs .ant-tabs-tab {
                                padding: 8px 16px;
                                margin: 0 8px 0 0;
                                background: white;
                                border-radius: 8px;
                                transition: all 0.3s;
                            }

                            .activity-timeline-tabs .ant-tabs-tab:hover {
                                background: #f3f4f6;
                            }

                            .activity-timeline-tabs .ant-tabs-tab-active {
                                background: #e5e7eb !important;
                            }

                            .activity-timeline-tabs .ant-tabs-content {
                                background: #f9fafb;
                                border-radius: 12px;
                                margin-top: 16px;
                                color: rgba(0, 0, 54, 0.68);
                            }
                        `}</style>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};
export default ItineraryDetails;
