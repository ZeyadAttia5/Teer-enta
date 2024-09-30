import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DeleteUser from './elements/deleteUser.js';
import AddTourismGovernor from './elements/addTourismGovernor.js';
import AddAdmin from './elements/addAdmin.js';
import CreateCategory from './elements/CRUDactivitycategory/addActivityCategory.js';
import DeleteActivityCategory from './elements/CRUDactivitycategory/deleteActivityCategory.js';
import ViewActivityCategories from './elements/CRUDactivitycategory/viewActivityCategory.js';
import UpdateActivityCategory from './elements/CRUDactivitycategory/updateActivityCategory.js';
import CreateHistoricalTag from './elements/CRUGtag/historical/createHistoricalTag.js';
import DeleteHistoricalTag from './elements/CRUGtag/historical/deleteHistoricalTag.js';
import UpdateHistoricalTag from './elements/CRUGtag/historical/updateHistoricalTag.js';
import ViewHistoricalTag from './elements/CRUGtag/historical/viewHistoricalTag.js';
import CreatePreferenceTag from './elements/CRUGtag/preference/createPreferenceTag.js'; 
import ViewPreferenceTags from './elements/CRUGtag/preference/viewPreferenceTag.js';
import UpdatePreferenceTag from './elements/CRUGtag/preference/updatePreferenceTag.js'; 
import DeletePreferenceTag from './elements/CRUGtag/preference/deletePreferenceTag.js'; 
import DeleteActivityTag from './elements/CRUGtag/activity/deleteActivityTag.js';
import ViewActivityTags from './elements/CRUGtag/activity/viewActivityTag.js';
import UpdateActivityTag from './elements/CRUGtag/activity/updateActivityTag.js';
import CreateActivityTag from './elements/CRUGtag/activity/createActivityTag.js';
import { Toaster } from 'react-hot-toast';
import HistoricalPlacesRouting from './elements/historicalPlaces/historicalPlacesRouting.js';
import Signup from './screens/signup/Signup.js';
import Login from './screens/login/login.js';
import Profile from './screens/profile/profile.js';
import TouristWelcome from "./screens/TouristWelcome.jsx";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/delete-user" element ={<DeleteUser/>} />
          <Route path="/add-tourism-governor" element={<AddTourismGovernor/>} />
          <Route path="/add-admin" elemeny={<AddAdmin/>} />
          <Route path="/create-activity-category" element={<CreateCategory/>} />
          <Route path="/delete-activity-category" element={<DeleteActivityCategory/>}  />
          <Route path="/view-activity-categories" element={<ViewActivityCategories/>}/>
          <Route path="/update-activity-category" element={<UpdateActivityCategory/>} />
          <Route path="/create-historical-tag" element={<CreateHistoricalTag/>}/>
          <Route path="/delete-historical-tag" element={<DeleteHistoricalTag/>} />
          <Route path="/update-historical-tag" element={<UpdateHistoricalTag/>} />
          <Route path="/view-historical-tags" element={<ViewHistoricalTag/>} />
          <Route path="/create-preference-tag" element={<CreatePreferenceTag/>} />
          <Route path="/view-preference-tags" element={<ViewPreferenceTags />} />
          <Route path="/update-preference-tag" element={<UpdatePreferenceTag/>} />
          <Route path="/delete-preference-tag" element={<DeletePreferenceTag/>} />
          <Route path="/delete-activity-tag" element={<DeleteActivityTag/>} />
          <Route path="/update-activity-tag" element={<UpdateActivityTag/>} />
          <Route path="/create-activity-tag" element={<CreateActivityTag/>} />
          <Route path="/view-activity-tags" element={<ViewActivityTags/>} />
          <Route path="/welcome" element={<TouristWelcome />} />
        </Routes>
        {/* <HistoricalPlacesRouting /> */}
        <Toaster />
      </Router>
    </div>
  );
}

export default App;
