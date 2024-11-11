const jwt = require("jsonwebtoken");
const Token = require("../models/Users/Token");
const errorHandler = require("../Util/ErrorHandler/errorSender");

module.exports = async (req, res, next) => {
    const authHeader = req.headers["authorization"];

    // If there is no authorization header, continue to the next middleware
    if (!authHeader) {
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        // Attempt to verify the JWT token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_ACCESS);

        if (!decodedToken) {
            return next(); // Continue to the next middleware if the token is invalid
        }

        // Check if the token exists in the database
        const checkToken = await Token.findOne({ token: token });
        if (!checkToken || checkToken.blackListedToken) {
            return next(); // Continue to the next middleware if the token is blacklisted or not found
        }

        // Attach user info to the request object if token is valid and not blacklisted
        req.user = {
            _id: decodedToken.userId,
            hasProfile: decodedToken.hasProfile,
            role: decodedToken.userRole,
            accessToken: token
        };
        req.body.createdBy = req.user._id;

        // Proceed to the next middleware
        next();

    } catch (err) {
        // If JWT verification fails, continue to the next middleware instead of sending an error
        next();
    }
};
