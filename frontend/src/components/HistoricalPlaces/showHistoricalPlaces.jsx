import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getHistoricalPlace} from '../../api/historicalPlaces.ts';
import {Button, message, Space} from "antd";
import {CopyOutlined, MailOutlined} from "@ant-design/icons";
import {getCurrency} from "../../api/account.ts";


const PORT = process.env.REACT_APP_BACKEND_URL;

const ShowHistoricalPlaces = () => {
    const {id} = useParams();
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
            console.log("Currency:", response.data);
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

        const subject = `Check out this historical place: ${historicalPlace.name}`;

        const body = `
    Historical Place Details:
    Name: ${historicalPlace.name}
    Opening Hours: ${historicalPlace.openingHours}
    Location: ${historicalPlace.location}
    Description: ${historicalPlace.description}

    Tags:
    ${historicalPlace.tags.length > 0
            ? historicalPlace.tags.map(tag => `- ${tag.name}`).join('\n')
            : 'No tags available'}

    Tickets:
    ${historicalPlace.tickets.length > 0
            ? historicalPlace.tickets.map(ticket => `${ticket.type}:  ${ticket.price}`).join('\n')
            : 'No tickets available.'}

    More details and booking: ${window.location.origin}/historicalPlace/details/${historicalPlace._id}
  `;

        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };


    if (!historicalPlace) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <div
            className="max-w-3xl mx-auto mt-10 p-8 pb-10 mb-16 bg-white shadow-lg rounded-lg border border-gray-200  transition-transform duration-300 ease-in-out">
            <h2 className="text-3xl font-semibold mb-6 text-gray-700 text-center">{historicalPlace.name}</h2>
            <div className="mb-8 text-center">
                <Space>
                    <Button icon={<CopyOutlined/>} onClick={handleCopyLink}>
                        Copy Link
                    </Button>
                    <Button icon={<MailOutlined/>} onClick={handleShareEmail}>
                        Share via Email
                    </Button>
                </Space>
            </div>

            {/* Image section */}
            {historicalPlace.images && historicalPlace.images.length > 0 && (
                <div className="mb-8 group">
                    <img
                        className="w-full h-64 object-cover rounded-lg shadow-md transition-transform duration-300 ease-in-out group-hover:scale-775 group-hover:h-screen"
                        src={historicalPlace.images[0]}
                        alt={historicalPlace.name}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-600">Opening Hours</h3>
                    <p className="text-gray-700">{historicalPlace.openingHours}</p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-600">Location</h3>
                    <p className="text-gray-700">{historicalPlace.location}</p>
                </div>

                <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold mb-2 text-gray-600">Description</h3>
                    <p className="text-gray-700">{historicalPlace.description}</p>
                </div>

                <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold mb-2 text-gray-600">Tags</h3>
                    <ul className="space-y-2">
                        {historicalPlace.tags.map((tag, index) => (
                            <li
                                key={index}
                                className="flex justify-between bg-gray-100 p-3 rounded-md transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#496989] hover:text-white"
                            >
                                <span className="font-medium">{tag.name}</span>
                                <span className="font-semibold">({tag.type})</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold mb-2 text-gray-600">Tickets</h3>
                    {historicalPlace.tickets.length > 0 ? (
                        <ul className="space-y-2">
                            {historicalPlace.tickets.map((ticket, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between bg-gray-100 p-3 rounded-md transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#496989] hover:text-white"
                                >
                                    <span className="font-medium">{ticket.type}</span>
                                    <span
                                        className="font-semibold"> {currency?.rate * ticket.price} {currency?.code}</span>
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
