import React, { useEffect, useState } from "react";
// import airplaneImage from "../../assets/airplane.png";
// import bedroom from "../../assets/bedroom.png";
// import banat from "../../assets/banat.png";
import { Fade } from "react-awesome-reveal";
import TermsAndConditions from "./TermsAndConditions/TermsAndConditions";
import logo from "../../assets/logo/logo2.jpg";
import { Button, Card, Tooltip } from "antd";
import hotelSVG from "../../assets/svgs/hotel.svg";
import taxi from "../../assets/svgs/taxi.svg";
import planeSVG from "../../assets/svgs/plane.svg";
import { getHistoricalPlaces } from "../../api/historicalPlaces.ts";
import { getTouristActivities } from "../../api/activity.ts";
import { Link, useNavigate } from "react-router-dom";
import {
  getCurrency,
  getSuggestedActivites,
  getSuggestedItinerary,
} from "../../api/account.ts";
import VacationGuide from "../../components/VacationGuide.jsx";
import {
  Hotel,
  Train,
  TrainIcon,
  Plane,
  PlaneIcon,
  PlaneTakeoff,
} from "lucide-react";
import {
  DollarCircleOutlined,
  EnvironmentTwoTone,
  GlobalOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { getGoogleMapsAddress } from "../../api/googleMaps.ts";
import BookHotel from "../Hotel/BookHotel.jsx";
import BookFlight from "../Flight/BookFlight.jsx";
import BookTransportation from "../Transportation/BookTransportation.jsx";
import ActivityCard from "../Activity/TouristActivity/ActivityCard.js";
import dayjs from "dayjs";
import { getItineraries } from "../../api/itinerary.ts";
import { getSavedActivities } from "../../api/profile.ts";
import { getAllMyRequests } from "../../api/notifications.ts";
import ItineraryCard from "../Itinerary/ItineraryCard";

// const cards = [
//   {
//     superTitle: "GET Started",
//     title: "Book your Flight!",
//     desc: "The best part about booking a flight is that you don’t need to stress over the details – just pick your destination, and you’re halfway there. Whether it’s a quick getaway or an adventure abroad, booking is simple and hassle-free. No complicated steps, just click and get ready to take off!",
//     img: airplaneImage,
//     waterMark: "01",
//     btnText: "Book Your Flight Now",
//     btnLink: "/flight/bookFlight",
//   },
//   {
//     superTitle: "Next Step",
//     title: "Book your Hotel!",
//     desc: "The great thing about finding a place to stay is that you don’t need anything fancy – just a cozy bed and a warm welcome. Booking a hotel is as easy as picking your favorite spot, and we’ll take care of the rest. No need to overthink it – comfort is waiting for you at the tap of a button!",
//     img: bedroom,
//     waterMark: "02",
//     btnText: "Book Your Hotel Now",
//     btnLink: "/hotel/book",
//   },
//   {
//     superTitle: "where you go is the key",
//     title: "Plan your Trip!",
//     desc: "Planning your trip is easier than you think – just choose where you want to go, and we’ll help with the rest. From flights and hotels to local tour guides, must-see landmarks, and transportation options, we’ve got everything covered. Customize your adventure, explore at your own pace, and let us handle the details so you can enjoy the journey.",
//     img: banat,
//     waterMark: "03",
//     btnText: "Plan Your Trip Now",
//     btnLink: "/",
//   },
// ];

const TouristWelcome = ({ setFlag }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedButton, setSelectedButton] = useState(1);
  setFlag(false);
  const [notAccepted, setNotAccepted] = useState(true);
  const [historicalPlaces, setHistoricalPlaces] = useState([]);

  useEffect(() => {
    const fetchHistoricalPlaces = async () => {
      try {
        const response = await getHistoricalPlaces();
        setHistoricalPlaces(response.data);
      } catch (error) {
        console.error("Error fetching historical places:", error);
      }
    };
    fetchHistoricalPlaces();
  }, []);

  const [touristActivities, setTouristActivities] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchTouristActivities = async () => {
      try {
        var activitiesResponse;
        if(user){
          activitiesResponse = await getSuggestedActivites();
        }else{
          activitiesResponse = await getTouristActivities();
        }
        if (!mounted) return;

        const activitiesWithRatings = activitiesResponse.data.map(
          (activity) => {
            const totalRating = activity.ratings.reduce(
              (acc, curr) => acc + curr.rating,
              0
            );
            const avgRating =
              activity.ratings.length > 0
                ? (totalRating / activity.ratings.length).toFixed(1)
                : 0;
            return { ...activity, averageRating: parseFloat(avgRating) };
          }
        );

        if (user) {
          const [savedResponse, notificationResponse] = await Promise.all([
            getSavedActivities(),
            getAllMyRequests(),
          ]);

          if (!mounted) return;

          const savedActivitiesId = savedResponse.data.savedActivities.map(
            (activity) => activity._id
          );

          const notificationRequests =
            notificationResponse.data.notificationsRequests || [];
          const notificationLookup = notificationRequests.reduce((acc, req) => {
            acc[req.activity] = req.status === "Pending";
            return acc;
          }, {});

          activitiesWithRatings.forEach((activity) => {
            activity.isSaved = savedActivitiesId.includes(activity._id);
            activity.hasNotification =
              notificationLookup[activity._id] || false;
          });
        }

        if (!mounted) return;
        setTouristActivities(activitiesWithRatings);
      } catch (error) {
        console.error("Error fetching tourist activities:", error);
      }
    };

    fetchTouristActivities();

    return () => {
      mounted = false;
    };
  }, [user]);

  const [currency, setCurrency] = useState(null);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await getCurrency();
        setCurrency(response.data);
        // console.log("Currency:", response.data);
      } catch (error) {
        console.error("Fetch currency error:", error);
      }
    };
    fetchCurrency();
  }, []);
  const handleBookItinerary = (id) => {
    navigate(`/itinerary/book/${id}`);
  };
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchItineraries = async () => {
      setLoading(true);
      try {
        var data;
        if(user){
          data = await getSuggestedItinerary();
          setItineraries(data.data);
        }else{
          data = await getItineraries();
          setItineraries(data);
        }
        
      } catch (error) {
        // message.error("Failed to fetch itineraries");
      }
      setLoading(false);
    };
    fetchItineraries();
  }, []);

  var loc;
  useEffect(() => {
    const fetchAddress = async () => {};
    fetchAddress();
  }, [loc]);

  const callMaps = async (loc) => {
    var y;
    try {
      const response = await getGoogleMapsAddress(loc);
      const formattedAddress =
        response.data.results[0]?.formatted_address || "Address not found";

      y = formattedAddress;
    } catch (error) {
      console.error("Error fetching address:", error);
    }
    // console.log("y is", y);

    return y.slice(0, 10);
  };

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const locs = await Promise.all(
        touristActivities.map(async (activity) => {
          const loc = activity.location;
          if (loc && loc.lat && loc.lng) {
            const address = await callMaps({ lat: loc.lat, lng: loc.lng });
            return address;
          }
          return "Location not found";
        })
      );
      setLocations(locs);
    };

    if (touristActivities.length > 0) {
      fetchLocations();
    }
  }, [touristActivities]);

  return (
    <div className="relative mt-16 ">
      {notAccepted &&
        user &&
        (user.userRole === "TourGuide" ||
          user.userRole === "Advertiser" ||
          user.userRole === "Seller") &&
        !user.isTermsAndConditionsAccepted && (
          <TermsAndConditions setNotAccepted={setNotAccepted} />
        )}
      <div className='relative flex flex-col  items-center h-[100vh] before:content-[""] before:bg-fit before:bg-no-repeat before:size-full before:absolute before:z-[0] before:animate-tourist-background'>
        <Fade
          className="text-white left-[100px] top-[15%] absolute"
          direction="up"
          cascade
        >
          <h1 className="lg:text-[70px] text-xl leading-10 sm:text-[50px] sm:leading-[50px] font-semibold lg:leading-[100px] ">
            Prepare To See The <br />
            World!
          </h1>
        </Fade>
        <Fade
          className="text-white left-[100px] top-[44%] absolute"
          direction="up"
          cascade
        >
          <span className="flex gap-2">
            <img
              src={logo}
              alt="Teer-Enta Logo"
              className="w-[40px] 
               h-auto rounded-full"
            />
            <div className="flex flex-col justify-center">
              <span>
                Originals by <span className="font-bold">Teer-Enta</span>
              </span>
            </div>
          </span>
        </Fade>
        <Fade
          className="text-white left-[100px] top-[51%] absolute text-2xl font-bold"
          direction="up"
          cascade
        >
          <span>See the Vatican Museums like never before</span>
        </Fade>

        {user && user.userRole === "Tourist" && (
          <div className="fixed bottom-4 right-4 z-10">
            <VacationGuide />
          </div>
        )}

        <div className="absolute justify-around top-[72%] w-3/4 flex">
          <button
            className={`px-12 py-4 flex items-center rounded-lg gap-2 font-bold focus:outline-none active:outline-none ring-0 text-2xl  ${
              selectedButton === 1
                ? "bg-backgroundColor text-first"
                : "bg-transparent text-white"
            }`}
            type="danger"
            onClick={() => setSelectedButton(1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>
            For you
          </button>
          <button
            className={`px-12 py-4 font-bold rounded-lg flex items-center gap-2 text-2xl  ${
              selectedButton === 2
                ? "bg-backgroundColor text-first"
                : "bg-transparent text-white"
            }`}
            type="danger"
            onClick={() => setSelectedButton(2)}
          >
            <Train />
            Transportations
          </button>
          <button
            className={`px-12 py-4 flex gap-2 items-center rounded-lg font-bold ring-0  text-2xl ${
              selectedButton === 3
                ? "bg-backgroundColor text-first"
                : "bg-transparent text-white"
            }`}
            type="danger"
            onClick={() => setSelectedButton(3)}
          >
            <Hotel />
            Hotels
          </button>
          <button
            className={`px-12 py-4 flex gap-2 items-center rounded-lg font-bold ring-0  text-2xl ${
              selectedButton === 4
                ? "bg-backgroundColor text-first"
                : "bg-transparent text-white"
            }`}
            type="danger"
            onClick={() => setSelectedButton(4)}
          >
            <PlaneTakeoff />
            Flights
          </button>
        </div>
      </div>
      {selectedButton === 1 && (
        <div>
          <span className="text-4xl font-bold text-first ml-12">
            Top historical places around the world
          </span>

          <div className="flex justify-center ">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 w-[90%]">
              {historicalPlaces?.slice(0, 4).map((place, index) => (
                <Link to={`/historicalPlace/details/${place?._id}`}>
                  <div className="relative hover:shadow-xl hover:border-b-2 transition-transform border-b-2 border-backgroundColor ease-in-out duration-300 hover:border-black">
                    <img
                      className="w-full h-48 object-cover mb-2"
                      src={place?.images.length > 0 && place?.images[0]}
                      alt={historicalPlaces?.name}
                      loading="lazy"
                    />
                    <span
                      className="absolute top-1 left-1 rounded-xl font-bold text-xl text-white p-2"
                      style={{ backgroundColor: "rgba(26, 43, 73, 0.85)" }}
                    >
                      {place.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {historicalPlaces.length > 4 && (
              <div className="flex flex-col justify-center mt-4">
                <Button
                  type="danger"
                  className="w-fit  rounded-full"
                  href="/historicalPlace"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="h-6 w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </Button>
              </div>
            )}
          </div>

          <span className="text-4xl font-bold text-first ml-12 mt-16 block mb-3">
            Top itineraries you can't miss
          </span>

          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-8 w-[90%]">
              {itineraries?.slice(1, 4).map((itinerary, index) => (
                  <ItineraryCard
                      key={index}
                      itinerary={itinerary}
                      currency={currency}
                      handleBookItinerary={handleBookItinerary}
                      navigate={navigate}
                      user={user}
                  />
              ))}
            </div>
            {itineraries.length > 3 && (
              <div className="flex flex-col justify-center">
                <Button
                  type="danger"
                  className="w-fit  rounded-full"
                  href="/itinerary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="h-6 w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </Button>
              </div>
            )}
          </div>

          <span className="text-4xl font-bold mb-3 text-first ml-12 mt-8 block">
            Top activities you can't miss
          </span>

          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-8 w-[90%]">
              {touristActivities?.slice(5, 8).map((place) => (
                // <Link key={place._id} to={`/itinerary/activityDetails/${place._id}`}>
                <ActivityCard
                  id={place._id}
                  name={place.name}
                  date={dayjs(place.date).format("MMM DD, YYYY")}
                  time={place.time}
                  isBookingOpen={place.isBookingOpen}
                  location={{
                    lat: place.location.lat,
                    lng: place.location.lng,
                  }}
                  price={place.price} // Using price.min for display and filtering
                  category={place.category ? place.category.category : "N/A"}
                  preferenceTags={
                    place.preferenceTags
                      ? place.preferenceTags.map((tag) => tag.tag)
                      : []
                  }
                  averageRating={place.averageRating} // Pass average rating to ActivityCard
                  isSaved={place.isSaved} // Pass isSaved to ActivityCard
                  hasNotification={place.hasNotification}
                  currencyCode={currency?.code}
                  currencyRate={currency?.rate}
                />
                // </Link>
              ))}
            </div>
            {touristActivities.length > 4 && (
              <div className="flex flex-col justify-center mt-4">
                <Button
                  type="danger"
                  className="w-fit  rounded-full"
                  href="/touristActivities"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="h-6 w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {selectedButton === 2 && <BookTransportation />}
      {selectedButton === 3 && <BookHotel />}
      {selectedButton === 4 && <BookFlight />}
    </div>
  );
};

export default TouristWelcome;
