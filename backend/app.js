require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const dbUrl = process.env.DB_URL;
const PORT= process.env.PORT || 8000;
const app = express();

const activityRoutes = require('./routes/activity');


app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
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

app.use(bodyParser.json({type: "application/json", limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false}));
mongoose.connect(dbUrl).then(r => {
    console.log('Connected to DB');
}).catch(e => {
    console.error(e);
    console.log('Could not connect to DB.');
    console.log(dbUrl);
})

app.use("/activity", activityRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "this page doesnt exist" });
});
app.listen(PORT);