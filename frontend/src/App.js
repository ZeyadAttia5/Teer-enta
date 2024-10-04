import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DeleteUser from "./components/deleteUser.js";
import AddTourismGovernor from "./components/addTourismGovernor.js";
import AddAdmin from "./components/addAdmin.js";
import CreateCategory from "./components/CRUDactivitycategory/addActivityCategory.js";
import DeleteActivityCategory from "./components/CRUDactivitycategory/deleteActivityCategory.js";
import ViewActivityCategory from "./components/CRUDactivitycategory/viewActivityCategory.js";
import UpdateActivityCategory from "./components/CRUDactivitycategory/updateActivityCategory.js";
import { Toaster } from "react-hot-toast";
import Signup from "./screens/signup/Signup.js";
import Login from "./screens/login/login.js";
import Profile from "./screens/profile/profile.js";
import CreateActivity from "./components/CRUDactivity/createActivity.js";
import ViewActivity from "./components/CRUDactivity/viewActivity.js"; // Standardized name
import UpdateActivity from "./components/CRUDactivity/updateActivity.js";
import DeleteActivity from "./components/CRUDactivity/deleteActivity.js";
import CreateTag from "./components/CRUDtag/createTag.js";
import ViewTag from "./components/CRUDtag/viewTag.js"; // Standardized name
import UpdateTag from "./components/CRUDtag/updateTag.js";
import DeleteTag from "./components/CRUDtag/deleteTag.js";
import CreateTouristItinerary from "./components/CRUDtouristItinerary/createTouristItinerary.js";
import ReadTouristItinerary from "./components/CRUDtouristItinerary/readTouristItinerary.js";
import ReadAllTouristItinerary from "./components/CRUDtouristItinerary/readAllTouristItinerary.js";
import UpdateTouristItinerary from "./components/CRUDtouristItinerary/updateTouristItinerary.js";
import Activity from "./screens/Activity.tsx"; // From feat/activities

import TouristWelcome from "./screens/TouristWelcome.jsx";
import ReadHistoriaclPlaces from './components/historicalPlaces/readHistoriaclPlaces.jsx';
import CreateHistoricalPlaces from './components/historicalPlaces/createHistoricalPlaces.jsx';
import UpdateHistoricalPlaces from './components/historicalPlaces/updateHistoriaclPlaces.jsx';
import DeleteHistoricalPlaces from './components/historicalPlaces/deleteHistoriaclPlaces.jsx';
import AllUsers from "./components/Users/viewUsers/viewAllUsers";
import PendingUsers from "./components/Users/pendingUsers/pendingUsers";
import AddUser from "./components/Users/addUser/addUser";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<TouristWelcome/>}/> // t
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          {/*<Route path="/delete-user" element={<DeleteUser />} />*/}
          {/*<Route path="/add-tourism-governor" element={<AddTourismGovernor />} />*/}
          {/*<Route path="/add-admin" element={<AddAdmin />} />*/}
          <Route path="/create-activity-category" element={<CreateCategory />} />
          <Route path="/delete-activity-category" element={<DeleteActivityCategory />} />
          <Route path="/view-activity-categories" element={<ViewActivityCategory />} />
          <Route path="/update-activity-category" element={<UpdateActivityCategory />} />
          <Route path="/create-activity" element={<CreateActivity />} />
          <Route path="/view-activity" element={<ViewActivity />} />
          <Route path="/update-activity/:id" element={<UpdateActivity />} />
          <Route path="/delete-activity/:id" element={<DeleteActivity />} />
          <Route path="/view-activities" element={<ViewActivity />} /> 
          <Route path="/update-activity" element={<UpdateActivity />} />
          <Route path="/delete-activity" element={<DeleteActivity />} />
          <Route path="/create-tag" element={<CreateTag />} />
          <Route path="/view-tags" element={<ViewTag />} />
          <Route path="/update-tag" element={<UpdateTag />} />
          <Route path="/delete-tag" element={<DeleteTag />} />
          <Route path="/create-tourist-itinerary" element={<CreateTouristItinerary />}/>
          <Route path="/read-tourist-itinerary" element={<ReadTouristItinerary />}/>
          <Route path="/read-all-tourist-itinerary" element={<ReadAllTouristItinerary />}/>
          <Route path="/update-tourist-itinerary" element={<UpdateTouristItinerary />}/>
          <Route path="/activity" element={<Activity />} />
          <Route path="/historicalPlace" element={<ReadHistoriaclPlaces />} /> //tested
          <Route path="/historicalPlace/create" element={<CreateHistoricalPlaces />} /> //tested
          <Route path="/historicalPlace/update/:id" element={<UpdateHistoricalPlaces />} /> //tested
          <Route path="/historicalPlace/delete/:id" element={<DeleteHistoricalPlaces />} /> //tested
          <Route path="/allUsers" element={<AllUsers />} /> //tested
          <Route path="/pendingUsers" element={<PendingUsers />} /> //tested
          <Route path="/addUser" element={<AddUser />} /> //tested
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;
