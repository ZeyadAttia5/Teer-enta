import "./index.css";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import DeleteUser from "./components/deleteUser.js";
import AddTourismGovernor from "./components/addTourismGovernor.js";
import AddAdmin from "./components/addAdmin.js";
import {Toaster} from "react-hot-toast";
import Signup from "./screens/signup/Signup.js";
import Login from "./screens/login/login.js";
import Profile from "./screens/profile/profile.js";
import CreateActivity from "./components/CRUDactivity/createActivity.js";
import ViewActivity from "./components/CRUDactivity/viewActivity.js";
import UpdateActivity from "./components/CRUDactivity/updateActivity.js";
import DeleteActivity from "./components/CRUDactivity/deleteActivity.js";
import CreateTouristItinerary from "./components/CRUDtouristItinerary/createTouristItinerary.js";
import ReadTouristItinerary from "./components/CRUDtouristItinerary/readTouristItinerary.js";
import ReadAllTouristItinerary from "./components/CRUDtouristItinerary/readAllTouristItinerary.js";
import UpdateTouristItinerary from "./components/CRUDtouristItinerary/updateTouristItinerary.js";
import Activity from "./screens/Activity/Activity.tsx"; // From feat/activities

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
import Activities from "./screens/Activities.tsx";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<TouristWelcome/>}/> // t
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/create-activity" element={<CreateActivity/>}/>
                    <Route path="/view-activity" element={<ViewActivity/>}/>
                    {/*<Route path="/update-activity/:id" element={<UpdateActivity />} />*/}
                    {/*<Route path="/delete-activity/:id" element={<DeleteActivity />} />*/}
                    {/*<Route path="/view-activities" element={<ViewActivity />} /> */}
                    {/*<Route path="/update-activity" element={<UpdateActivity />} />*/}
                    {/*<Route path="/delete-activity" element={<DeleteActivity />} />*/}
                    <Route path="/preference-tags" element={<PreferenceTags/>}/>
                    <Route path="/activities" element={<Activities/>}/>
                    <Route path="/activity-categories" element={<ActivityCategories/>}/>
                    <Route path="/tags" element={<Tags/>}/>
                    <Route path="/touristItinerary/create" element={<CreateTouristItinerary/>}/>
                    <Route path="/touristItinerary/view" element={<ReadTouristItinerary/>}/>
                    <Route path="/touristItinerary" element={<ReadAllTouristItinerary/>}/>
                    <Route path="/touristItinerary/update" element={<UpdateTouristItinerary/>}/>
                    <Route path="/activity" element={<Activity/>}/>
                    <Route path="/historicalPlace" element={<ReadHistoriaclPlaces/>}/>
                    <Route path="/historicalPlace/create" element={<CreateHistoricalPlaces/>}/>
                    <Route path="/historicalPlace/update/:id" element={<UpdateHistoricalPlaces/>}/>
                    <Route path="/historicalPlace/delete/:id" element={<DeleteHistoricalPlaces/>}/>
                    <Route path="/allUsers" element={<AllUsers/>}/>
                    <Route path="/pendingUsers" element={<PendingUsers/>}/>
                    <Route path="/addUser" element={<AddUser/>}/>
                    <Route path="/products" element={<ProductGrid/>}/>
                    <Route path="/product/:id" element={<ProductDetails/>}/>
                    <Route path="/admin/product/form" element={<AdminProductForm/>}/>
                    <Route path="/admin/products" element={<AdminProductGrid/>}/>
                    <Route path="/admin/edit-product/:productId" element={<EditProductForm/>}/>
                    <Route path="/tourguide-itinerary" element={<TourGuideItinerary/>}/>
                </Routes>
                <Toaster/>
            </Router>
        </div>
    );
}

export default App;
