import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getHistoricalPlace } from '../../api/historicalPlaces.ts';
import { getCurrency } from "../../api/account.ts";
import {Card, Button, message, Skeleton, Tag, Typography, Carousel, Divider} from "antd";
import {
    CopyOutlined,
    MailOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    TagOutlined, InfoCircleOutlined,
} from "@ant-design/icons";
import {TicketIcon} from "lucide-react";

const { Title, Paragraph } = Typography;

function TicketOutlined(props: { className: string }) {
    return null;
}

const ShowHistoricalPlaces = () => {
    const { id } = useParams();
    const [historicalPlace, setHistoricalPlace] = useState(null);
    const [currency, setCurrency] = useState(null);

    useEffect(() => {
        const fetchHistoricalPlace = async () => {
            try {
                const response = await getHistoricalPlace(id);
                setHistoricalPlace(response.data);
            } catch (error) {
                console.error("Error fetching historical place details:", error);
            }
        };
        fetchHistoricalPlace();
    }, [id]);

    const fetchCurrency = async () => {
        try {
            const response = await getCurrency();
            setCurrency(response.data);
            // console.log("Currency:", response.data);
        } catch (error) {
            console.error("Fetch currency error:", error);
        }
    }
    useEffect(() => {
        fetchCurrency();
    }, []);

    const handleCopyLink = () => {
        const link = `${window.location.origin}/historicalPlace/details/${historicalPlace._id}`;
        navigator.clipboard.writeText(link).then(
            () => message.success("Link copied to clipboard!"),
            () => message.warning("Failed to copy the link")
        );
    };

    const handleShareEmail = () => {
        if (!historicalPlace) return;

        const subject = `Check out this historical place: ${historicalPlace?.name}`;

        const body = `
    Historical Place Details:
    Name: ${historicalPlace?.name}
    Opening Hours: ${historicalPlace?.openingHours}
    Location: ${historicalPlace?.location}
    Description: ${historicalPlace?.description}

    Tags:
    ${historicalPlace?.tags.length > 0
            ? historicalPlace?.tags.map(tag => `- ${tag.name}`).join('\n')
            : 'No tags available'}

    Tickets:
    ${historicalPlace?.tickets.length > 0
            ? historicalPlace?.tickets.map(ticket => `${ticket.type}:  ${ticket.price}`).join('\n')
            : 'No tickets available.'}

    More details and booking: ${window.location.origin}/historicalPlace/details/${historicalPlace?._id}
  `;

        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };

    if (!historicalPlace) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-5xl mx-auto px-4">
                <Card className="border-none">
                    {/* Header Section */}
                    <div className="text-center mb-6">
                        <Title level={1} className="text-4xl mb-4">
                            {historicalPlace?.name}
                        </Title>
                        <div className="flex justify-center space-x-4">
                            <Button
                                type="danger"
                                icon={<CopyOutlined />}
                                onClick={handleCopyLink}
                                className="bg-blue-950 hover:bg-black text-white"
                            >
                                Copy Link
                            </Button>
                            <Button
                                icon={<MailOutlined />}
                                onClick={handleShareEmail}
                            >
                                Share via Email
                            </Button>
                        </div>
                    </div>

                    {/* Image Carousel */}
                    {historicalPlace?.images?.length > 0 && (
                        <div className="mb-8">
                            <Carousel autoplay>
                                {historicalPlace.images.map((image, index) => (
                                    <div key={index}>
                                        <img
                                            src={image}
                                            alt={`${historicalPlace.name} - ${index + 1}`}
                                            className="w-full h-96 object-cover rounded"
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    )}

                    {/* Quick Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="flex items-center">
                            <ClockCircleOutlined className="  text-blue-950 mr-2 text-lg" />
                            <div>
                                <div className="text-gray-500 text-sm">Opening Hours</div>
                                <div>{historicalPlace?.openingHours}</div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <EnvironmentOutlined className="  text-blue-950 mr-2 text-lg" />
                            <div>
                                <div className="text-gray-500 text-sm">Location</div>
                                <div>{historicalPlace?.location}</div>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    {/* Description */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <InfoCircleOutlined className="text-blue-950 mr-2 text-lg" />
                            <Title level={4} className="m-0">Description</Title>
                        </div>
                        <Paragraph className="text-gray-700">
                            {historicalPlace?.description}
                        </Paragraph>
                    </div>

                    <Divider />

                    {/* Tags */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <TagOutlined className="  text-blue-950 mr-2 text-lg" />
                            <Title level={4} className="m-0">Tags</Title>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {historicalPlace?.tags?.map((tag, index) => (
                                <div key={index} className="flex gap-2">
                                    <Tag color="blue">{tag.name}</Tag>
                                    <Tag color="cyan">{tag.type}</Tag>
                                    <Tag color="gold">{tag.historicalPeriod}</Tag>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Divider />

                    {/* Tickets */}
                    <div>
                        <div className="flex items-center mb-4">
                            <TicketOutlined className="  text-blue-950 mr-2 text-lg" />
                            <Title level={4} className="m-0">Tickets</Title>
                        </div>
                        {historicalPlace?.tickets?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {historicalPlace.tickets.map((ticket, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded">
                                        <div className="text-lg font-medium mb-1">
                                            {ticket.type}
                                        </div>
                                        <div className="text-xl text-blue-950 font-semibold">
                                            {currency?.rate * ticket.price} {currency?.code}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Paragraph className="text-gray-500 italic">
                                No tickets available.
                            </Paragraph>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ShowHistoricalPlaces;

