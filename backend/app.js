require('dotenv').config();
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const dbUrl = process.env.DB_URL;
const PORT= process.env.PORT || 8000;
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activity');
const activityCategoryRoutes = require('./routes/activityCategory');
const itineraryRoutes = require('./routes/Itinerary');
const historicalPlacesRoutes = require('./routes/historicalPlace');
const tagRoutes = require('./routes/tag');
const preferenceTagRoutes = require('./routes/preferenceTags');
const profileRoutes = require('./routes/profile');
const accountRoutes = require('./routes/account');
const productRoutes = require('./routes/product');
const touristIteneraryRoutes = require('./routes/touristItenerary');

app.use(morgan('dev'))
app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Accept, Origin, X-Requested-With"
    );
    if (req.method === 'OPTIONS') {
        return res.status(200).end();

    }
    next();

});
app.use(cors());
app.use(bodyParser.json({type: "application/json", limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false}));
mongoose.connect(dbUrl).then(r => {
    console.log('Connected to DB');
    console.log(PORT)
}).catch(e => {
    console.error(e);
    console.log('Could not connect to DB.');
    console.log(dbUrl);
})

app.use("/activity", activityRoutes);
app.use("/itinerary", itineraryRoutes);
app.use("/historicalPlace", historicalPlacesRoutes);
app.use("/activityCategory", activityCategoryRoutes);
app.use("/tag", tagRoutes);
app.use("/preferenceTag", preferenceTagRoutes);
app.use("/auth" , authRoutes ) ;
app.use("/profile", profileRoutes);
app.use("/account" , accountRoutes) ;
app.use("/product" , productRoutes) ;
app.use("/touristItenerary" , touristIteneraryRoutes) ;

app.use((req, res) => {
    res.status(404).json({ message: "this page doesnt exist" });
});

app.listen(PORT);