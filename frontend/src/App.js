import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DeleteUser from "./components/deleteUser.js";
import AddTourismGovernor from "./components/addTourismGovernor.js";
import AddAdmin from "./components/addAdmin.js";
import CreateCategory from "./components/CRUDactivitycategory/addActivityCategory.js";
import DeleteActivityCategory from "./components/CRUDactivitycategory/deleteActivityCategory.js";
import ViewActivityCategories from "./components/CRUDactivitycategory/viewActivityCategory.js";
import UpdateActivityCategory from "./components/CRUDactivitycategory/updateActivityCategory.js";
import { Toaster } from "react-hot-toast";
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
import Navbar from "./components/Store/navbar";
import ProductGrid from "./components/Store/productGrid";
import ProductDetails from "./components/Store/productDetails";
import AdminProductForm from "./components/Store/adminProductForm";
import AdminProductGrid from "./components/Store/adminProductGrid";
import EditProductForm from "./components/Store/editProductForm";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/delete-user" element={<DeleteUser />} />
          <Route
            path="/add-tourism-governor"
            element={<AddTourismGovernor />}
          />
          <Route path="/add-admin" element={<AddAdmin />} />
          <Route
            path="/create-activity-category"
            element={<CreateCategory />}
          />
          <Route
            path="/delete-activity-category"
            element={<DeleteActivityCategory />}
          />
          <Route
            path="/view-activity-categories"
            element={<ViewActivityCategories />}
          />
          <Route
            path="/update-activity-category"
            element={<UpdateActivityCategory />}
          />
          <Route path="/create-activity" element={<CreateActivity />} />
          <Route path="/view-activity" element={<ViewActivity />} />
          <Route path="/update-activity" element={<UpdateActivity />} />
          <Route path="/delete-activity" element={<DeleteActivity />} />
          <Route path="/create-tag" element={<CreateTag />} />
          <Route path="/view-tag" element={<ViewTag />} />
          <Route path="/update-tag" element={<UpdateTag />} />
          <Route path="/delete-tag" element={<DeleteTag />} />
          <Route
            path="create-tourist-itinerary"
            element={<CreateTouristItinerary />}
          />

          <Route
            path="read-tourist-itinerary"
            element={<ReadTouristItinerary />}
          />
          <Route
            path="read-all-tourist-itinerary"
            element={<ReadAllTouristItinerary />}
          />
          <Route
            path="update-tourist-itinerary"
            element={<UpdateTouristItinerary />}
          />
          {/*<Navbar />*/}
          <Route path="/all-products" element={<ProductGrid />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/product/form" element={<AdminProductForm />} />
          <Route path="/product/adminGrid" element={<AdminProductGrid />} />
          <Route path="/admin/edit-product/:productId" element={<EditProductForm />} />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;
