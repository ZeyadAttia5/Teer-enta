import React, {useState, useEffect, useRef} from "react";
import HistoricalPlaceSingleCard from "./historicalPlaceSingleCard";
import {MdOutlineAddBox} from "react-icons/md";
import {Link, useLocation} from "react-router-dom";
import {Input, Select, Slider, Row, Col, Checkbox, Button} from "antd";
import {Filter, SortAsc, ChevronRight, Star} from 'lucide-react'
import {notification} from "antd";
import {getMyHistoricalPlaces, getHistoricalPlaces} from "../../api/historicalPlaces.ts";
import {getTags} from "../../api/tags.ts";
import {ReloadOutlined} from '@ant-design/icons';
import {SearchOutlined} from "@ant-design/icons";
import {getCurrency} from "../../api/account.ts";


const PORT = process.env.REACT_APP_BACKEND_URL;
const {Search} = Input;


const Button1 = ({children, onClick, variant = 'default'}) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-fourth ";
    const variantClasses = variant === 'outline'
        ? "hover:bg-third hover:text-accent-foreground" // Light gray hover background for outline variant
        : "text-gray-700 hover:bg-third"; // Light gray hover background for default variant

    return (
        <button className={`${baseClasses} ${variantClasses} h-10 px-4`} onClick={onClick}>
            {children}
        </button>
    )
}

const Button2 = ({children, onClick, variant = 'default'}) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-fourth";
    const variantClasses = variant === 'outline'
        ? "hover:bg-gray-100 hover:text-accent-foreground" // Light gray hover background for outline variant
        : "text-gray-700 hover:bg-gray-100"; // Light gray hover background for default variant

    return (
        <Button className={`${baseClasses} ${variantClasses} h-10 py-2 px-4`} onClick={onClick} type="primary"
                danger
                icon={<ReloadOutlined/>}
        >
            {children}
        </Button>
    )
}

const DropdownMenu = ({children}) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])


    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {React.Children.map(children, child =>
                React.cloneElement(child, {isOpen, setIsOpen})
            )}
        </div>
    )
}

const DropdownMenuTrigger = ({children, isOpen, setIsOpen}) => {
    return React.cloneElement(children, {
        onClick: () => setIsOpen(!isOpen),
        'aria-expanded': isOpen,
        'aria-haspopup': true,
    })
}

const DropdownMenuContent = ({children, isOpen}) => {
    if (!isOpen) return null
    return (
        <div className="absolute right-0 left-0 mt-2 w-56 rounded-md shadow-lg bg-white text-gray-700 z-50">
            <div className="py-1">{children}</div>
        </div>
    )
}

const DropdownMenuLabel = ({children}) => <div className="px-3 py-2 text-sm font-semibold">{children}</div>
const DropdownMenuSeparator = () => <hr className="my-1 border-border"/>
const DropdownMenuGroup = ({children}) => <div>{children}</div>

const DropdownMenuItem = ({children, onSelect}) => (
    <button
        className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-default"
        onClick={onSelect}
    >
        {children}
    </button>
)

const DropdownMenuPortal = ({children}) => {
    return <div className="relative cursor-pointer">{children}</div>
}

const DropdownMenuSub = ({trigger, children}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative"
             onMouseEnter={() => setIsOpen(true)}
             onMouseLeave={() => setIsOpen(false)}
        >
            <DropdownMenuSubTrigger onClick={() => setIsOpen(prev => !prev)}>
                {trigger}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent isOpen={isOpen}>
                    {children}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </div>
    );
};

const DropdownMenuSubTrigger = ({children, onClick}) => (
    <button
        className="w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-accent hover:text-accent-foreground"

    >
        {children}
        <ChevronRight className="h-4 w-4"/>
    </button>
);

const DropdownMenuSubContent = ({children, isOpen}) => {
    if (!isOpen) return null;
    return (
        <div
            className="absolute left-full top-1/2 -translate-y-10 w-56 rounded-md shadow-lg bg-white text-gray-700 z-50">
            <div className="py-1 px-1 bg-white hover:bg-gray-100 hover:border-transparent rounded-md">{children}</div>
        </div>
    );
};


const ReadHistoriaclPlaces = ({setFlag}) => {
    setFlag(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [historicalPlacesData, setHistoricalPlacesData] = useState([]);
    const [tags, setTags] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = localStorage.getItem("accessToken");
    const userRole = user?.userRole;
    const location = useLocation();
    const [currency,setCurrency] = useState(null);

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
        fetchCurrency() ;
        if (location.pathname === "/historicalPlace/my") {
            const fetchMyHistoricalPlaces = async () => {
                try {
                    const response = await getMyHistoricalPlaces();
                    setHistoricalPlacesData(response.data);
                } catch (error) {
                    if (error.response.status === 404) {
                        notification.info({message: "You didnt create any historical places yet"})
                    } else {
                        notification.error({message: "Error fetching historical places"});
                    }
                }
            }
            fetchMyHistoricalPlaces();
        } else {
            const fetchHistoricalPlaces = async () => {
                try {
                    const response = await getHistoricalPlaces();
                    setHistoricalPlacesData(response.data);
                } catch (error) {
                    console.error("Error fetching historical places:", error);
                }
            };
            fetchHistoricalPlaces();
        }
    }, [location.pathname]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await getTags();
                setTags(response.data);
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        fetchTags();
    }, []);

    const uniqueTagTypes = [...new Set(tags.map((tag) => tag.type))];

    const filteredPlaces = historicalPlacesData.filter(
        (place) =>
            (selectedTag
                ? place.tags.some((tag) => tag.type === selectedTag)
                : true) &&
            ((place.name &&
                    place.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (place.location &&
                    place.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
                place.tags.some((tag) =>
                    tag.type.toLowerCase().includes(searchTerm.toLowerCase())
                ))
    );

    const resetFilters = () => {
        setSelectedTag('');
        setSearchTerm('');
    };

    return (
        <div className="py-6 px-16">
            <div className="mb-6 flex justify-center">
                <Search
                    enterButton={<SearchOutlined className=""/>}
                    placeholder="Search by name, location, or tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 rounded-md w-[400px]"
                />
            </div>

            <div className="mb-6 flex justify-center space-x-4">
                {/* Tag Filter Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button1 variant="outline" className="">
                            <Filter className="mr-2 h-4 w-4"/>
                            Filter by Tag
                        </Button1>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <div>
                                    <select
                                        id="tagFilter"
                                        value={selectedTag}
                                        onChange={(e) => setSelectedTag(e.target.value)}
                                        className="w-full p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-100 hover:border-transparent"
                                    >
                                        <option value="">All Tags</option>
                                        {uniqueTagTypes?.map((tagType, index) => (
                                            <option key={index} value={tagType}>
                                                {tagType}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

               
                <Button
                    type="danger"
                    
                    icon={<ReloadOutlined/>}
                    onClick={resetFilters}
                    className="ml-4 h-10 text-black bg-fourth hover:bg-third"
                >
                    Remove filters
                </Button>
            </div>


            {userRole === "TourismGovernor" && (
                <div className="flex justify-end p-4 w-full">
                    <Link to="/historicalPlace/create">
                        <button
                            className="flex items-center px-4 py-2 bg-sky-800 text-white rounded-lg shadow hover:bg-sky-700 transition-all duration-300 ease-in-out">
                            <span className="mr-2">Create New</span>
                            <MdOutlineAddBox className="text-2xl"/>
                        </button>
                    </Link>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlaces?.map((place, index) => (
                    <HistoricalPlaceSingleCard currency={{code: currency?.code, rate: currency?.rate}}  key={index} places={place}/>
                ))}
            </div>
        </div>
    );
};

export default ReadHistoriaclPlaces;
