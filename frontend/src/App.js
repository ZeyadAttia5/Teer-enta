import './App.css';
import DeleteUser from './components/deleteUser.js';
import AddTourismGovernor from './components/addTourismGovernor.js';
import AddAdmin from './components/addAdmin.js';
import CreateCategory from './components/addActivityCategory.js';
import DeleteActivityCategory from './components/deleteActivityCategory.js';
import ViewActivityCategories from './components/viewActivityCategory.js';
import UpdateActivityCategory from './components/updateActivityCategory.js';
import CreateHistoricalTag from './components/createHistoricalTag.js';
import DeleteHistoricalTag from './components/deleteHistoricalTag.js';
import UpdateHistoricalTag from './components/updateHistoricalTag.js';
import ViewHistoricalTag from './components/viewHistoricalTag.js';
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

    </div>
    
  );
}

export default App;
