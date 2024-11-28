import React, { useState, useEffect } from "react";
import { Table, Button, ConfigProvider, Spin, Tooltip } from "antd";
import {
    Flag,
    AlertTriangle,
    Globe,
    MapPin,
    DollarSign,
    AlertCircle
} from 'lucide-react';
import { getFlaggedItineraries, unflagIternaary } from "../../api/itinerary.ts";
import { getCurrency } from "../../api/account.ts";

const FlaggedIternary = ({ setFlag }) => {
    setFlag(false);
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState(null);
    const [totalFlagged, setTotalFlagged] = useState(0);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [currencyResponse, itinerariesResponse] = await Promise.all([
                getCurrency(),
                getFlaggedItineraries()
            ]);

            setCurrency(currencyResponse.data);
            setItineraries(itinerariesResponse);
            setTotalFlagged(itinerariesResponse.length);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUnflag = async (id) => {
        try {
            await unflagIternaary(id);
            await fetchData();
        } catch (error) {
            console.error("Error unflagging itinerary:", error);
        }
    };

    const columns = [
        {
            title: "Itinerary Name",
            dataIndex: "name",
            key: "name",
            render: (text) => (
                <div className="font-medium text-[#1C325B]">{text}</div>
            ),
        },
        {
            title: "Language",
            dataIndex: "language",
            key: "language",
            render: (text) => (
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#1C325B]" />
                    <span>{text}</span>
                </div>
            ),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => (
                <div className="flex items-center gap-2 font-medium text-emerald-600">
                    <DollarSign className="w-4 h-4" />
                    {currency?.code} {(currency?.rate * price).toFixed(2)}
                </div>
            ),
        },
        {
            title: "Accessibility",
            dataIndex: "accessibility",
            key: "accessibility",
            render: (text) => (
                <div className="flex items-center gap-2">
                    {/*<Wheelchair className="w-4 h-4 text-[#1C325B]" />*/}
                    <span>{text}</span>
                </div>
            ),
        },
        {
            title: "Pickup Location",
            dataIndex: "pickupLocation",
            key: "pickupLocation",
            render: (text) => (
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#1C325B]" />
                    <span>{text}</span>
                </div>
            ),
        },
        {
            title: "Drop Off Location",
            dataIndex: "dropOffLocation",
            key: "dropOffLocation",
            render: (text) => (
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>{text}</span>
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Tooltip title="Remove flag from this itinerary">
                    <Button
                        onClick={() => handleUnflag(record._id)}
                        className="border-none shadow-none hover:bg-red-50 text-red-500 hover:text-red-600"
                        icon={<Flag className="w-4 h-4" />}
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#1C325B",
                },
            }}
        >
            <div className="min-h-screen bg-gray-50/50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 mb-8 text-white">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle className="w-6 h-6 text-white" />
                                <h1 className="text-2xl font-bold text-white">
                                    Flagged Itineraries
                                </h1>
                            </div>
                            <p className="text-gray-400">
                                Review and manage reported itineraries
                            </p>
                        </div>

                        {/* Stats Card */}
                        <div className="mb-8">
                            <div className="bg-[#1C325B]/5 p-6 rounded-xl border border-[#1C325B]/10">
                                <div className="flex items-center gap-3">
                                    <Flag className="w-5 h-5 text-[#1C325B]" />
                                    <span className="text-[#1C325B] font-medium">
                                        Total Flagged Itineraries: {totalFlagged}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Spin size="large" />
                            </div>
                        ) : itineraries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 gap-3">
                                <div className="p-4 bg-gray-100/80 rounded-full">
                                    <AlertCircle className="w-10 h-10 text-[#1C325B]/30" />
                                </div>
                                <p className="text-gray-500 font-medium text-lg">
                                    No flagged itineraries found
                                </p>
                            </div>
                        ) : (
                            <Table
                                columns={columns}
                                dataSource={itineraries}
                                rowKey="_id"
                                loading={loading}
                                pagination={{
                                    pageSize: 10,
                                    showTotal: (total) => `Total ${total} itineraries`
                                }}
                                className="border border-gray-200 rounded-lg"
                                rowClassName="hover:bg-[#1C325B]/5"
                            />
                        )}
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default FlaggedIternary;