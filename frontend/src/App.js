import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DeleteUser from './components/deleteUser.js';
import AddTourismGovernor from './components/addTourismGovernor.js';
import AddAdmin from './components/addAdmin.js';
import CreateCategory from './components/CRUDactivitycategory/addActivityCategory.js';
import DeleteActivityCategory from './components/CRUDactivitycategory/deleteActivityCategory.js';
import ViewActivityCategories from './components/CRUDactivitycategory/viewActivityCategory.js';
import UpdateActivityCategory from './components/CRUDactivitycategory/updateActivityCategory.js';
import CreateHistoricalTag from './components/CRUGtag/historical/createHistoricalTag.js';
import DeleteHistoricalTag from './components/CRUGtag/historical/deleteHistoricalTag.js';
import UpdateHistoricalTag from './components/CRUGtag/historical/updateHistoricalTag.js';
import ViewHistoricalTag from './components/CRUGtag/historical/viewHistoricalTag.js';
import CreatePreferenceTag from './components/CRUGtag/preference/createPreferenceTag.js'; 
import ViewPreferenceTags from './components/CRUGtag/preference/viewPreferenceTag.js';
import UpdatePreferenceTag from './components/CRUGtag/preference/updatePreferenceTag.js'; 
import DeletePreferenceTag from './components/CRUGtag/preference/deletePreferenceTag.js'; 
import DeleteActivityTag from './components/CRUGtag/activity/deleteActivityTag.js';
import ViewActivityTags from './components/CRUGtag/activity/viewActivityTag.js';
import UpdateActivityTag from './components/CRUGtag/activity/updateActivityTag.js';
import CreateActivityTag from './components/CRUGtag/activity/createActivityTag.js';
import { Toaster } from 'react-hot-toast';
import HistoricalPlacesRouting from './components/historicalPlaces/historicalPlacesRouting.js';
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
          <Route path="/delete-user" component={DeleteUser} />
          <Route path="/add-tourism-governor" component={AddTourismGovernor} />
          <Route path="/add-admin" component={AddAdmin} />
          <Route path="/create-activity-category" component={CreateCategory} />
          <Route
            path="/delete-activity-category"
            component={DeleteActivityCategory}
          />
          <Route
            path="/view-activity-categories"
            component={ViewActivityCategories}
          />
          <Route
            path="/update-activity-category"
            component={UpdateActivityCategory}
          />
          <Route
            path="/create-historical-tag"
            component={CreateHistoricalTag}
          />
          <Route
            path="/delete-historical-tag"
            component={DeleteHistoricalTag}
          />
          <Route
            path="/update-historical-tag"
            component={UpdateHistoricalTag}
          />
          <Route path="/view-historical-tags" component={ViewHistoricalTag} />
          <Route
            path="/create-preference-tag"
            component={CreatePreferenceTag}
          />
          <Route
            path="/view-preference-tags"
            element={<ViewPreferenceTags />}
          />
          <Route
            path="/update-preference-tag"
            component={UpdatePreferenceTag}
          />
          <Route
            path="/delete-preference-tag"
            component={DeletePreferenceTag}
          />
          <Route path="/delete-activity-tag" component={DeleteActivityTag} />
          <Route path="/update-activity-tag" component={UpdateActivityTag} />
          <Route path="/create-activity-tag" component={CreateActivityTag} />
          <Route path="/view-activity-tags" component={ViewActivityTags} />
          <Route path="/welcome" element={<TouristWelcome />} />
        </Routes>
        {/* <HistoricalPlacesRouting /> */}
        <Toaster />
      </Router>
    </div>
  );
}

export default App;
