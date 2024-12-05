import React from 'react';
import {Button, Rate, Tooltip} from 'antd';
import {
    EnvironmentOutlined, ClockCircleOutlined, TeamOutlined, GlobalOutlined
} from '@ant-design/icons';

const ItineraryCard = ({itinerary, navigate, currency}) => {
    return (
        <div className="w-[380px] transition-shadow duration-300 hover:shadow-xl cursor-pointer bg-white rounded-lg overflow-hidden border border-gray-200" onClick={() => navigate(`iternaryDetails/${itinerary?._id}`)}>
            <div className="relative h-[280px]">
                <img src={itinerary.imageUrl || "/api/placeholder/400/320"} alt={itinerary.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/70 via-transparent to-transparent"/>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-xl font-bold tracking-wide truncate mb-2">{itinerary.name}</h3>
                    <div className="flex items-center space-x-3">
                        <Rate disabled defaultValue={itinerary.rating || 0} className="text-[#FFD700] text-sm"/>
                        <span className="text-white/90 text-sm">{itinerary.reviews?.length ? `(${itinerary.reviews.length} reviews)` : '(No reviews yet)'}</span>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex flex-wrap gap-2">
                    <div className={`px-3 py-1 rounded-md text-sm font-medium inline-flex items-center ${itinerary.isBookingOpen ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${itinerary.isBookingOpen ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                        {itinerary.isBookingOpen ? 'Booking Open' : 'Booking Closed'}
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        <GlobalOutlined className="mr-1"/>{itinerary.language}
                    </div>
                </div>
            </div>

            <div className="p-4">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div><EnvironmentOutlined className="text-[#2A3663] text-base"/></div>
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">From</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 block truncate pl-2">{itinerary.pickupLocation}</span>
                                </div>
                                <div className="px-4 text-center">
                                    <div>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#2A3663]">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div><EnvironmentOutlined className="text-[#2A3663] text-base"/></div>
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">To</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 block truncate pl-2">{itinerary.dropOffLocation}</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg p-4 space-y-1">
                                <div className="flex items-center gap-2">
                                    <ClockCircleOutlined className="text-[#2A3663]"/>
                                    <span className="text-xs text-gray-500">Duration</span>
                                </div>
                                <span className="text-sm font-medium text-gray-700 block">
                {itinerary.timeline.reduce((acc, curr) => acc + curr.duration, 0)} minutes
              </span>
                            </div>
                            <div className="rounded-lg p-4 space-y-1">
                                <div className="flex items-center gap-2">
                                    <TeamOutlined className="text-[#2A3663]"/>
                                    <span className="text-xs text-gray-500">Accessibility</span>
                                </div>
                                <span className="text-sm font-medium text-gray-700 block truncate">{itinerary.accessibility || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="bg-white rounded-lg p-3">
                            <span className="text-xs text-gray-500 block mb-1">Price per person</span>
                            <div className="flex items-center space-x-1">
                                <span className="text-base font-semibold text-[#2A3663] bg-gray-50 px-2 py-1 rounded">{currency?.code}</span>
                                <span className="text-3xl font-bold text-[#2A3663]">{(itinerary.price * currency?.rate).toFixed(2)}</span>
                            </div>
                        </div>
                        <Button
                            type={itinerary.isBookingOpen ? "danger" : "default"}
                            onClick={(e) => {e.stopPropagation(); navigate(`/itineraries/book/${itinerary._id}`);}}
                            className={`px-6 h-10 rounded-lg font-medium shadow-sm ${
                                itinerary.isBookingOpen
                                    ? 'bg-[#2A3663] hover:bg-black text-white'
                                    : 'bg-gray-100 text-gray-500 cursor-not-allowed hover:bg-gray-100'
                            }`}
                            disabled={!itinerary.isBookingOpen }
                        >
                            {itinerary.isBookingOpen  ? "Book Now" : "Not Available"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItineraryCard;