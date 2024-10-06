import "./index.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DeleteUser from "./components/deleteUser.js";
import AddTourismGovernor from "./components/addTourismGovernor.js";
import AddAdmin from "./components/addAdmin.js";
import { Toaster } from "react-hot-toast";
import Signup from "./screens/signup/Signup.js";
import Login from "./screens/login/login.js";
import Profile from "./screens/profile/profile.js";
import CreateTouristItinerary from "./components/CRUDtouristItinerary/createTouristItinerary.js";
import ReadTouristItinerary from "./components/CRUDtouristItinerary/readTouristItinerary.js";
import ReadAllTouristItinerary from "./components/CRUDtouristItinerary/readAllTouristItinerary.js";
import UpdateTouristItinerary from "./components/CRUDtouristItinerary/updateTouristItinerary.js";
import ActivityList from "./screens/Activity/ActivityList.tsx"; // From feat/activities
import { useLocation } from "react-router-dom";
import TouristWelcome from "./screens/TouristWelcome.jsx";
import ReadHistoriaclPlaces from "./components/historicalPlaces/readHistoriaclPlaces.jsx";
import CreateHistoricalPlaces from "./components/historicalPlaces/createHistoricalPlaces.jsx";
import UpdateHistoricalPlaces from "./components/historicalPlaces/updateHistoriaclPlaces.jsx";
import DeleteHistoricalPlaces from "./components/historicalPlaces/deleteHistoriaclPlaces.jsx";
import AllUsers from "./components/Users/viewUsers/viewAllUsers";
import PendingUsers from "./components/Users/pendingUsers/pendingUsers";
import AddUser from "./components/Users/addUser/addUser";

import Navbar from "./components/Store/navbar";
import ProductGrid from "./components/Store/productGrid";
import ProductDetails from "./components/Store/productDetails";
import AdminProductForm from "./components/Store/adminProductForm";
import AdminProductGrid from "./components/Store/adminProductGrid";
import EditProductForm from "./components/Store/editProductForm";
import TourGuideItinerary from "./screens/Itinerary/ItineraryScreen.jsx";
import PreferenceTags from "./screens/Itinerary/PrefrenceTags.tsx";
import ActivityCategories from "./screens/Activity/ActivityCategories.tsx";
import Tags from "./screens/Tags.tsx";
import DrawerBar from "./components/Drawer.js";
import TouristNavBar from "./components/TouristNavBar.jsx";
import AllActivitiesCRUD from "./screens/Activity/AllActivitiesCRUD.tsx";
import { set } from "date-fns";

function App() {
  const [flag, setFlag] = useState(false);

  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div className="App">
      <Router>
        {!flag && (
          <div className=" relative bg-[#075B4C] z-10 overflow-scroll size-full flex flex-col items-center  before:content-[''] before:bg-fit before:bg-no-repeat before:size-full before:absolute before:z-[0] before:animate-tourist-background">
            <TouristNavBar />
          </div>
        )}
        {!flag && (
          <DrawerBar
            onClose={onClose}
            showDrawer={showDrawer}
            drawerVisible={visible}
          />
        )}
        <Routes>
        <Route path="/" element={<TouristWelcome setFlag={setFlag} />} />
          <Route path="/signup" element={<Signup setFlag={setFlag} />} />
          <Route path="/login" element={<Login setFlag={setFlag} />} />
          <Route path="/profile" element={<Profile setFlag={setFlag} />} />
          <Route path="/preference-tags" element={<PreferenceTags setFlag={setFlag} />} />
          <Route path="/activities" element={<AllActivitiesCRUD setFlag={setFlag} />} />
          <Route path="/activities/my" element={<AllActivitiesCRUD setFlag={setFlag} />} />
          <Route path="/activity-categories" element={<ActivityCategories setFlag={setFlag} />} />
          <Route path="/tags" element={<Tags setFlag={setFlag} />} />
          <Route path="/touristItinerary/create" element={<CreateTouristItinerary setFlag={setFlag} />} />
          <Route path="/touristItinerary/view" element={<ReadTouristItinerary setFlag={setFlag} />} />
          <Route path="/touristItinerary" element={<ReadAllTouristItinerary setFlag={setFlag} />} />
          <Route path="/touristItinerary/update" element={<UpdateTouristItinerary setFlag={setFlag} />} />
          <Route path="/activity" element={<ActivityList setFlag={setFlag} />} />
          <Route path="/historicalPlace" element={<ReadHistoriaclPlaces setFlag={setFlag} />} />
          <Route path="/historicalPlace/my" element={<ReadHistoriaclPlaces setFlag={setFlag} />} />
          <Route path="/historicalPlace/create" element={<CreateHistoricalPlaces setFlag={setFlag} />} />
          <Route path="/historicalPlace/update/:id" element={<UpdateHistoricalPlaces setFlag={setFlag} />} />
          <Route path="/historicalPlace/delete/:id" element={<DeleteHistoricalPlaces setFlag={setFlag} />} />
          <Route path="/allUsers" element={<AllUsers setFlag={setFlag} />} />
          <Route path="/pendingUsers" element={<PendingUsers setFlag={setFlag} />} />
          <Route path="/addUser" element={<AddUser setFlag={setFlag} />} />
          <Route path="/products" element={<AdminProductGrid setFlag={setFlag} />} />
          <Route path="/products/:id" element={<ProductDetails setFlag={setFlag} />} />
          <Route path="/products/create" element={<AdminProductForm setFlag={setFlag} />} />
          <Route path="/admin/edit-product/:productId" element={<EditProductForm setFlag={setFlag} />} />
          <Route path="/itinerary" element={<TourGuideItinerary setFlag={setFlag} />} />
          <Route path="/itinerary/my" element={<TourGuideItinerary setFlag={setFlag} />} />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;
