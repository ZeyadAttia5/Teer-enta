const User = require('../models/Users/User');
const Tourist = require('../models/Users/Tourist');
const bcrypt = require('bcryptjs');
const TourGuide = require('../models/Users/TourGuide');
const Advertiser = require('../models/Users/Advertiser');
const Seller = require('../models/Users/Seller');

exports.signup = async (req, res) => {
    try {
        const userRole = req.body.userRole;
        if (!userRole) {
            return res.status(400).send({message: 'User role is required.'});
        }
        const emailExists = await User.findOne({email: req.body.email});
        if (emailExists) {
            return res.status(400).send({message: 'Email already exists.'});
        }
        const usernameExists = await User.findOne({username: req.body.username});
        if (usernameExists) {
            return res.status(400).send({message: 'Username already exists.'});
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        switch (userRole) {
            case 'Tourist':
                const tourist = new Tourist({
                    email: req.body.email,
                    username: req.body.username,
                    password: hashedPassword,
                    userRole: userRole,
                    mobileNumber: req.body.mobileNumber,
                    nationality: req.body.nationality,
                    dateOfBirth: req.body.dateOfBirth,
                    occupation: req.body.occupation,
                    hasProfile: true
                });
                await tourist.save();
                return res.status(201).send({message: 'Tourist created successfully.'});
            case 'TourGuide':
                const tourGuide = new TourGuide({
                    email: req.body.email,
                    username: req.body.username,
                    password: hashedPassword,
                    userRole: userRole
                });
                await tourGuide.save();
                return res.status(201).send({message: 'TourGuide created successfully.'});
            case 'Advertiser' :
                const advertiser = new Advertiser({
                    email: req.body.email,
                    username: req.body.username,
                    password: hashedPassword,
                    userRole: userRole
                });
                await advertiser.save();
                return res.status(201).send({message: 'Advertiser created successfully.'});
            case 'Seller' :
                const seller = new Seller({
                    email: req.body.email,
                    username: req.body.username,
                    password: hashedPassword,
                    userRole: userRole
                });
                await seller.save();
                return res.status(201).send({message: 'Seller created successfully.'});
        }

    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).send({message: err.message, errors: err.data});
    }
}