import "./index.css";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import DeleteUser from "./components/deleteUser.js";
import AddTourismGovernor from "./components/addTourismGovernor.js";
import AddAdmin from "./components/addAdmin.js";
import CreateCategory from "./components/CRUDactivitycategory/addActivityCategory.js";
import DeleteActivityCategory from "./components/CRUDactivitycategory/deleteActivityCategory.js";
import ViewActivityCategories from "./components/CRUDactivitycategory/viewActivityCategory.js";
import UpdateActivityCategory from "./components/CRUDactivitycategory/updateActivityCategory.js";
import {Toaster} from "react-hot-toast";
import Signup from "./screens/signup/Signup.js";
import Login from "./screens/login/login.js";
import Profile from "./screens/profile/profile.js";
import CreateActivity from "./components/CRUDactivity/createActivity.js";
import ViewActivity from "./components/CRUDactivity/viewActivity.js";
import UpdateActivity from "./components/CRUDactivity/updateActivity.js";
import DeleteActivity from "./components/CRUDactivity/deleteActivity.js";
import CreateTag from "./components/CRUDtag/createTag.js";
import ViewTag from "./components/CRUDtag/viewTag.js";
import UpdateTag from "./components/CRUDtag/updateTag.js";
import DeleteTag from "./components/CRUDtag/deleteTag.js";
import CreateTouristItinerary from "./components/CRUDtouristItinerary/createTouristItinerary.js";
import ReadTouristItinerary from "./components/CRUDtouristItinerary/readTouristItinerary.js";
import ReadAllTouristItinerary from "./components/CRUDtouristItinerary/readAllTouristItinerary.js";
import UpdateTouristItinerary from "./components/CRUDtouristItinerary/updateTouristItinerary.js";
import AllUsers from "./components/Users/viewUsers/viewAllUsers";
import AddUser from "./components/Users/addUser/addUser";
import PendingUsers from "./components/Users/pendingUsers/pendingUsers";


function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Signup/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/delete-user" element={<DeleteUser/>}/>
                    <Route
                        path="/add-tourism-governor"
                        element={<AddTourismGovernor/>}
                    />
                    <Route path="/add-admin" element={<AddAdmin/>}/>
                    <Route
                        path="/create-activity-category"
                        element={<CreateCategory/>}
                    />
                    <Route
                        path="/delete-activity-category"
                        element={<DeleteActivityCategory/>}
                    />
                    <Route
                        path="/view-activity-categories"
                        element={<ViewActivityCategories/>}
                    />
                    <Route
                        path="/update-activity-category"
                        element={<UpdateActivityCategory/>}
                    />
                    <Route path="/create-activity" element={<CreateActivity/>}/>
                    <Route path="/view-activity" element={<ViewActivity/>}/>
                    <Route path="/update-activity" element={<UpdateActivity/>}/>
                    <Route path="/delete-activity" element={<DeleteActivity/>}/>
                    <Route path="/create-tag" element={<CreateTag/>}/>
                    <Route path="/view-tag" element={<ViewTag/>}/>
                    <Route path="/update-tag" element={<UpdateTag/>}/>
                    <Route path="/delete-tag" element={<DeleteTag/>}/>
                    <Route
                        path="create-tourist-itinerary"
                        element={<CreateTouristItinerary/>}
                    />

                    <Route
                        path="read-tourist-itinerary"
                        element={<ReadTouristItinerary/>}
                    />
                    <Route
                        path="read-all-tourist-itinerary"
                        element={<ReadAllTouristItinerary/>}
                    />
                    <Route
                        path="update-tourist-itinerary"
                        element={<UpdateTouristItinerary/>}
                    />
                    <Route path="all-users" element={<AllUsers/>}></Route>
                    <Route path="add-user" element={<AddUser/>}></Route>
                    <Route path="pending-users" element={<PendingUsers/>}></Route>
                </Routes>
                <Toaster/>
            </Router>
        </div>
    );
}

export default App;
