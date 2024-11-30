import "./index.css";
import React, {useState, useEffect, useCallback} from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; // Make sure this is imported
import { Toaster } from "react-hot-toast";
import Signup from "./components/Auth/Signup/Signup.js";
import Login from "./components/Auth/Login/login.js";
import Profile from "./components/Profile/profile.js";
import ActivityList from "./components/Activity/ActivityList.tsx"; // From feat/activities
import TouristWelcome from "./components/WelcomePage/TouristWelcome.jsx";
import ReadHistoriaclPlaces from "./components/HistoricalPlaces/readHistoriaclPlaces.jsx";
import CreateHistoricalPlaces from "./components/HistoricalPlaces/createHistoricalPlaces.jsx";
import UpdateHistoricalPlaces from "./components/HistoricalPlaces/updateHistoriaclPlaces.jsx";
import ShowHistoricalPlaces from "./components/HistoricalPlaces/showHistoricalPlaces.jsx";
import AllUsers from "./components/Users/viewUsers/viewAllUsers";
import PendingUsers from "./components/Users/pendingUsers/pendingUsers";
import AddUser from "./components/Users/addUser/addUser";
import BackButton from "./components/shared/BackButton.js";
import ProductDetails from "./components/Store/productDetails";
import AdminProductForm from "./components/Store/adminProductForm";
import AdminProductGrid from "./components/Store/adminProductGrid";
import EditProductForm from "./components/Store/editProductForm";
import QuantityAndSales from "./components/Store/quantityAndSales.jsx";
import CartComponent from "./components/Store/cart.jsx";
import IternaryScreen from "./components/Itinerary/ItineraryScreen.jsx";
import TourguideItineraryScreen from "./components/Itinerary/tourguide_ItineraryScreen.jsx";
import PreferenceTags from "./components/Tags/PrefrenceTags.tsx";
import ActivityCategories from "./components/Activity/ActivityCategories.tsx";
import Tags from "./components/Tags/Tags.tsx";
import DrawerBar from "./components/shared/SideBar/Drawer.js";
import TouristNavBar from "./components/shared/NavBar/TouristNavBar.jsx";
import AboutUs from "./components/shared/NavBar/AboutUs/AboutUs.js";
import AllActivitiesCRUD from "./components/Activity/AllActivitiesCRUD.tsx";
import ConfirmationModal from "./components/shared/ConfirmationModal.js";
import IternaryDetails from "./components/Itinerary/IternaryDetails.tsx";
import MyItineraryScreen from "./components/Itinerary/myIternaryScreen.jsx";
import ActivityDetails from "./components/Activity/ActivityDetails.tsx";
import TouristActivity from "./components/Activity/TouristActivity/TouristActivity.js";
import ChangePassword from "./components/Profile/ProfileComponents/ChangePassword.js";
import DeleteAccountButton from "./components/Profile/ProfileComponents/DeleteAccountButton.js";
import FlaggedIternary from "./components/Itinerary/FlaggedIternary.jsx";
import FlaggedActivities from "./components/Activity/FlaggedActivities.jsx";
import ComplaintsManagement from "./components/Users/complain/complaintsManagement.js";
import MyComplaints from "./components/Users/complain/myComplaints.js";
import ShowDocuments from "./components/Users/pendingUsers/ShowDocuments.js";
import BookHotel from "./components/Hotel/BookHotel.jsx";
import CreateTransportation from "./components/Transportation/CreateTransportation.jsx";
import BookTransportation from "./components/Transportation/BookTransportation.jsx";
import BookFlight from "./components/Flight/BookFlight.jsx";
import NewProfile from "./components/Profile/NewProfile.js";
import UnActiveActivities from "./components/Activity/UnActiveActivities.tsx";
import UnActiveIternaries from "./components/Itinerary/UnActiveIternaries.jsx";
import ForgotPassword from "./components/Auth/Password/ForgotPassword";
import ResetPassword from "./components/Auth/Password/ResetPassword";
import BookItinerary from "./components/Itinerary/bookItinerary";
import BookActivity from "./components/Activity/TouristActivity/bookActivity";
import Bookings from "./components/Users/bookings/bookings";
import UserReport from "./components/reports/UserReport.jsx";
import WishlistedProductGrid from "./components/Store/wishlistedProductGrid";
import MyActivities from "./components/Activity/TouristActivity/myActivities.js";
import PromoCodesAdmin from "./components/PromoCodeAdmin/PromoCodesAdmin.js";
import { toast, ToastContainer } from "react-toastify";
import CheckOutOrder from "./components/Store/checkOutOrder";
import OrderHistory from "./components/Store/orderHistory";
import OrderDetails from "./components/Store/orderDetails";
import {NotificationProvider} from "./components/notifications/NotificationContext";
import './services/firebase.js';
import {saveFCMTokenToServer} from "./api/notifications.ts";
import {initializeFirebaseMessaging, setupMessageListener} from "./services/firebase";

function AppContent() {
  const [flag, setFlag] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);
  const location = useLocation();
  const user = localStorage.getItem("user");
  const showBackButton = location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/signup";
  const [isNotificationIncoming, setIsNotificationIncoming] = useState(false);
  const [incomingNotification, setIncomingNotification] = useState(null);

  const handleNotification = useCallback((payload) => {
    console.log("Received foreground message:", payload);

    if (payload?.notification) {
      const newNotification = {
        _id: Date.now().toString(),
        title: payload.notification.title,
        body: payload.notification.body,
        isSeen: false,
        sentAt: new Date().toISOString(),
        data: payload.data // Include any additional data from payload
      };

      setIsNotificationIncoming(prev => !prev);
      setIncomingNotification(newNotification);

      toast(
          <div
              className="cursor-pointer hover:bg-gray-50 rounded p-2 transition-colors"
              onClick={()=> toast.dismiss()}
              onMouseEnter={() => toast.pause()}
              onMouseLeave={() => toast.play()}
          >
            <div className="font-bold">{newNotification.title}</div>
            <div className="text-sm">{newNotification.body}</div>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: "notification-toast",
          }
      );
    }
  }, []);

  // Initialize Firebase notifications
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const result = await initializeFirebaseMessaging();
        if (result.success) {
          // Setup message listener for foreground messages
          const unsubscribe = setupMessageListener(handleNotification);

          await saveFCMTokenToServer(result.token);

          // Cleanup function
          return () => {
            if (unsubscribe) {
              unsubscribe();
            }
          };
        } else {
          console.log("Failed to initialize Firebase messaging:", result.error);
        }
      } catch (error) {
        console.error("Error setting up notifications:", error);
      }
    };

    initializeNotifications();
  }, [handleNotification]);



  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isAuthenticated");
    setIsNavigate(true);
    setModalOpen(false);
  };

  return (

      <div className="App relative mb-8 bg-gray-50 font-playfair-display">
          <NotificationProvider
              incomingNotification={incomingNotification}
              isNotificationIncomming={isNotificationIncoming}
          >
              <ToastContainer />


        {!flag && (
          <DrawerBar
            onClose={onClose}
            showDrawer={showDrawer}
            drawerVisible={visible}
          />
        )}
        {!flag && (
          <div className="relative  z-10 size-full flex flex-col items-center">
            <TouristNavBar
              setModalOpen={setModalOpen}
              isNavigate={isNavigate}
              setIsNavigate={setIsNavigate}
            />
          </div>
        )}

        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={onLogout}
          message={`Are you sure you want to log out?`}
        />

        {showBackButton && (
          <div className="p-4 mt-[80px] bg-transparent">
            <BackButton />
          </div>
        )}

        <Routes>
          {/* General Routes */}
          <Route path="/" element={<TouristWelcome setFlag={setFlag} />} />
          {/* <Route path="/" element={<HomePage setFlag={setFlag} />} /> */}
          <Route path="/signup" element={<Signup setFlag={setFlag} />} />
          <Route
            path="/login"
            element={<Login setFlag={setFlag} flag={flag} />}
          />
          <Route path="/profile" element={<Profile setFlag={setFlag} />} />
          <Route
            path="/preference-tags"
            element={<PreferenceTags setFlag={setFlag} />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPassword setFlag={setFlag} />}
          />
          <Route
            path="/reset-password/:token"
            element={<ResetPassword setFlag={setFlag} />}
          />

          {/* Activity Routes */}
          <Route
            path="/activities"
            element={<AllActivitiesCRUD setFlag={setFlag} />}
          />
          <Route
            path="/flaggedActivities"
            element={<FlaggedActivities setFlag={setFlag} />}
          />
          <Route
            path="/activities/my"
            element={<AllActivitiesCRUD setFlag={setFlag} />}
          />
          <Route
            path="/activity-categories"
            element={<ActivityCategories setFlag={setFlag} />}
          />
          <Route path="/tags" element={<Tags setFlag={setFlag} />} />
          <Route
            path="/activity"
            element={<ActivityList setFlag={setFlag} />}
          />
          <Route
            path="/unActiveActivity"
            element={<UnActiveActivities setFlag={setFlag} />}
          />
          <Route
            path="/touristActivities"
            element={<TouristActivity setFlag={setFlag} />}
          />
          <Route
            path="/historicalPlace"
            element={<ReadHistoriaclPlaces setFlag={setFlag} />}
          />
          <Route
            path="/historicalPlace/my"
            element={<ReadHistoriaclPlaces setFlag={setFlag} />}
          />
          <Route
            path="/historicalPlace/create"
            element={<CreateHistoricalPlaces setFlag={setFlag} />}
          />
          <Route
            path="/historicalPlace/update/:id"
            element={<UpdateHistoricalPlaces setFlag={setFlag} />}
          />
          <Route
            path="/historicalPlace/details/:id"
            element={<ShowHistoricalPlaces setFlag={setFlag} />}
          />
          <Route path="/reports/*" element={<UserReport />} />

          {/* User Management Routes */}
          <Route path="/allUsers" element={<AllUsers setFlag={setFlag} />} />
          <Route
            path="/pendingUsers"
            element={<PendingUsers setFlag={setFlag} />}
          />
          <Route path="/showDocuments/:id" element={<ShowDocuments />} />
          <Route path="/addUser" element={<AddUser setFlag={setFlag} />} />
          <Route
            path="/changePassword"
            element={<ChangePassword setFlag={setFlag} />}
          />
          <Route
            path="/requestAccountDeletion"
            element={<DeleteAccountButton setFlag={setFlag} />}
          />
          <Route path="/newProfile" element={<NewProfile />} />
          {/* Product Management Routes */}
          <Route
            path="/products"
            element={<AdminProductGrid setFlag={setFlag} />}
          />
          <Route
            path="/wishlisted_products"
            element={<WishlistedProductGrid setFlag={setFlag} />}
          />
          <Route
            path="/products/:id"
            element={<ProductDetails setFlag={setFlag} />}
          />
          <Route
            path="/products/create"
            element={<AdminProductForm setFlag={setFlag} />}
          />
          <Route
            path="/products/edit/:productId"
            element={<EditProductForm setFlag={setFlag} />}
          />
          <Route
            path="/products/quantity&sales"
            element={<QuantityAndSales setFlag={setFlag} />}
          />
          <Route
            path="/products/cart"
            element={<CartComponent setFlag={setFlag} />}
          />
          <Route
            path="/checkOutOrder"
            element={<CheckOutOrder setFlag={setFlag} />}
          />
          <Route
            path="/orderHistory"
            element={<OrderHistory setFlag={setFlag} />}
          />
          <Route path="/order/:id" element={<OrderDetails />} />

          {/* Itinerary Routes */}
          <Route
            path="/itinerary/*"
            element={
              <Routes>
                <Route
                  path="activityDetails/:id"
                  element={<ActivityDetails setFlag={setFlag} />}
                />
                <Route
                  path="/"
                  element={<IternaryScreen setFlag={setFlag} />}
                />
                <Route
                  path="flaggedIternaries"
                  element={<FlaggedIternary setFlag={setFlag} />}
                />
                <Route
                  path="unActiveIternaries"
                  element={<UnActiveIternaries setFlag={setFlag} />}
                />
                <Route
                  path="iternaryDetails/:id"
                  element={<IternaryDetails setFlag={setFlag} />}
                />
                <Route
                  path="tourguide_itineraries"
                  element={<TourguideItineraryScreen setFlag={setFlag} />}
                />
              </Routes>
            }
          />
          <Route
            path="/itinerary/my"
            element={<MyItineraryScreen setFlag={setFlag} />}
          />

          {/* Hotel Routes */}
          <Route
            path="/hotel/*"
            element={
              <Routes>
                <Route path="book" element={<BookHotel setFlag={setFlag} />} />
              </Routes>
            }
          />

          {/* Transportation Routes */}
          <Route
            path="/transportation/*"
            element={
              <Routes>
                <Route
                  path="create"
                  element={<CreateTransportation setFlag={setFlag} />}
                />
                <Route
                  path="book"
                  element={<BookTransportation setFlag={setFlag} />}
                />
              </Routes>
            }
          />

          {/* Flight Routes */}
          <Route
            path="/flight/*"
            element={
              <Routes>
                <Route
                  path="bookFlight"
                  element={<BookFlight setFlag={setFlag} />}
                />
              </Routes>
            }
          />
          {/* Complaints Routes */}
          <Route
            path="/ComplaintsManagement"
            element={<ComplaintsManagement />}
          />
          <Route path="/myComplaints" element={<MyComplaints />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/itinerary/book/:id" element={<BookItinerary />} />
          <Route
            path="/touristActivities/book/:id"
            element={<BookActivity />}
          />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/savedActivities" element={<MyActivities />} />
          <Route path="/promoCodesAdmin" element={<PromoCodesAdmin />} />
        </Routes>
        <Toaster />
          </NotificationProvider>
      </div>

  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
