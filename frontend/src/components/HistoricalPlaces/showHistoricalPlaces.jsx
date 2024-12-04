import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getHistoricalPlace } from '../../api/historicalPlaces.ts';
import { Button, message, Space } from "antd";
import { CopyOutlined, MailOutlined } from "@ant-design/icons";
import { getCurrency } from "../../api/account.ts";

const PORT = process.env.REACT_APP_BACKEND_URL;

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
            () => message.error("Failed to copy the link")
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
        <div className="max-w-5xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 pb-7">
            <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">{historicalPlace?.name}</h1>
            <div className="mb-8 text-center">
                <Space>
                    <Button type='danger' className='hover:bg-gray-300 bg-white' icon={<CopyOutlined />} onClick={handleCopyLink}>
                        Copy Link
                    </Button>
                    <Button type='danger' className='hover:bg-gray-300 bg-white' icon={<MailOutlined />} onClick={handleShareEmail}>
                        Share via Email
                    </Button>
                </Space>
            </div>

            {historicalPlace?.images && historicalPlace?.images.length > 0 && (
                <div className="mb-12 group">
                    <img
                        className="w-full max-h-96 object-cover rounded-lg shadow-md transition-transform duration-300 ease-in-out"
                        src={historicalPlace?.images[0]}
                        alt={historicalPlace?.name}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-600">Opening Hours</h3>
                    <p className="text-gray-700">{historicalPlace?.openingHours}</p>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-600">Location</h3>
                    <p className="text-gray-700">{historicalPlace?.location}</p>
                </div>

                <div className="md:col-span-2">
                    <h3 className="text-xl font-bold mb-2 text-gray-600">Description</h3>
                    <p className="text-gray-700">{historicalPlace?.description}</p>
                </div>

                <div className="md:col-span-2">
                    <h3 className="text-xl font-bold mb-2 text-gray-600">Tags</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {historicalPlace?.tags?.map((tag, index) => (
                            <li
                                key={index}
                                className=" p-3 rounded-md transition-colors duration-300 hover:bg-gray-200"
                            >
                                
                
                  <React.Fragment key={tag.name + index}>
                    <span className="inline-block bg-green-100 rounded-full px-2 py-1 text-xs font-medium text-green-600 mr-1 mb-1">
                      {tag.name}
                    </span>
                    <span className="inline-block bg-blue-200 rounded-full px-2 py-1 text-xs font-medium text-blue-400 mr-1 mb-1">
                      {tag.type}
                    </span>
                    <span className="inline-block bg-yellow-100 rounded-full px-2 py-1 text-xs font-medium text-yellow-600 mr-1 mb-1">
                      {tag.historicalPeriod}
                    </span>
                  </React.Fragment>
                
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="md:col-span-2">
                    <h3 className="text-xl font-bold mb-2 text-gray-600">Tickets</h3>
                    {historicalPlace?.tickets?.length > 0 ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {historicalPlace?.tickets?.map((ticket, index) => (
                                <li
                                    key={index}
                                    className=" p-3 rounded-md transition-colors duration-300 hover:bg-gray-200"
                                >
                                    <span className="font-medium block">{ticket.type}</span>
                                    <span className="font-semibold block mt-1">
                                        {currency?.rate * ticket.price} {currency?.code}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700">No tickets available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShowHistoricalPlaces;

