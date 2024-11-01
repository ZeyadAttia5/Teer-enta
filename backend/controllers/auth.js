const User = require('../models/Users/User');
const Tourist = require('../models/Users/Tourist');
const TourGuide = require('../models/Users/TourGuide');
const Advertiser = require('../models/Users/Advertiser');
const Seller = require('../models/Users/Seller');
const bcrypt = require('bcryptjs');
const TokenHandler = require('../Util/TokenHandler/tokenGenerator');
const errorHandler = require("../Util/ErrorHandler/errorSender");

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
                    userRole: userRole,
                    isCardUrl: req.body.isCardUrl,
                    certificates: req.body.certificates
                });
                await tourGuide.save();
                return res.status(201).send({message: 'TourGuide created successfully.'});
            case 'Advertiser' :
                const advertiser = new Advertiser({
                    email: req.body.email,
                    username: req.body.username,
                    password: hashedPassword,
                    userRole: userRole,
                    isCardUrl: req.body.isCardUrl,
                    taxationCardUrl: req.body.taxationCardUrl
                });
                await advertiser.save();
                return res.status(201).send({message: 'Advertiser created successfully.'});
            case 'Seller' :
                const seller = new Seller({
                    email: req.body.email,
                    username: req.body.username,
                    password: hashedPassword,
                    userRole: userRole,
                    isCardUrl: req.body.isCardUrl,
                    taxationCardUrl: req.body.taxationCardUrl
                });
                await seller.save();
                return res.status(201).send({message: 'Seller created successfully.'});
        }

    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});
        if (!user) return res.status(404).json({message: 'User not found'});

        const doMatch = await bcrypt.compare(password, user.password);
        if (!doMatch) return res.status(401).json({message: "Wrong Password"});

        const status = user.isAccepted;

        if (status === "Pending") {
            return res.status(401).json({message: "Your request is still pending "});
        }
        if (status === "Rejected") {
            return res.status(403).json({message: "Your request is rejected"})
        }

        const {token: accessToken, expiresIn: accessExpiresIn} = await TokenHandler.generateAccessToken(user);
        const {token: refreshToken, expiresIn: refreshExpiresIn} = await TokenHandler.generateRefreshToken(user);

        res.status(200).json({
            accessToken,
            accessExpiresIn,
            refreshToken,
            refreshExpiresIn,
            user: user,
        });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const doMatch = await bcrypt.compare(req.body.oldPassword, user.password);
        console.log(doMatch);
        if (!doMatch) return res.status(401).json({message: "Wrong old Password"});
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 12);
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {password: hashedPassword}, {new: true});
        res.status(200).json({message: 'Password changed successfully.'});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}