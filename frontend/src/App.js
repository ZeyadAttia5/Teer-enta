import './App.css';
import DeleteUser from './components/deleteUser.js';
import AddTourismGovernor from './components/addTourismGovernor.js';
import AddAdmin from './components/addAdmin.js';
import CreateCategory from './components/addActivityCategory.js';
import DeleteActivityCategory from './components/deleteActivityCategory.js';
function App() {
  return (
    <div className="App">
      App
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
    </div>
    
  );
}

export default App;
