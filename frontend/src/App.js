import './index.css';
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
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HistoricalPlacesRouting from './components/historicalPlaces/historicalPlacesRouting.js';
function App() {
  return (
    <div className="App">
      <br></br>
      <DeleteUser/>
      <br></br>
      <br></br>
      <AddTourismGovernor/>
      <br></br>
      <AddAdmin/>
      <br></br>
      <CreateCategory/>
      <br></br>
      <DeleteActivityCategory/>
      <br></br>
      <ViewActivityCategories/>
      <br></br>
      <UpdateActivityCategory/>
      <br></br>
      <CreateHistoricalTag/>
      <br></br>
      <DeleteHistoricalTag/>
      <br></br>
      <UpdateHistoricalTag/>
      <br></br>
      <ViewHistoricalTag/>
      <br></br>
      <CreatePreferenceTag/>
      <br></br>
      <ViewPreferenceTags/>
      <br></br>
      <UpdatePreferenceTag/>
      <br></br>
      <DeletePreferenceTag/>
      <br></br>
      <DeleteActivityTag/>
      <br></br>
      <UpdateActivityTag/>
      <br></br>
      <CreateActivityTag/>
      <br></br>
      <ViewActivityTags/>
      <br></br>
      <Router>
          <HistoricalPlacesRouting/>
          <Toaster />
      </Router>
      <br></br>
    </div>
    
  );
}

export default App;
