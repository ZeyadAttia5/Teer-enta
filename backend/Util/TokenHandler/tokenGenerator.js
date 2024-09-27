const jwt = require("jsonwebtoken");
const Token = require("../../models/Users/Token");
const errorHandler = require("../ErrorHandler/errorSender");

const generateAccessToken = async (user) => {
    const accessToken = jwt.sign(
        { userId : user._id , userEmail: user.email , userRole: user.userRole },
        process.env.JWT_SECRET_ACCESS,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    const expiresIn = extractExpiryDate(accessToken);
    const createdAccessToken = await Token.create({
        token: accessToken,
        type: "ACCESS",
        expiresIn: expiresIn,
        createdBy: user._id
    });
    return { token: createdAccessToken.token, expiresIn };
};

const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign(
        { userId : user._id , userEmail: user.email , userRole: user.userRole },
        process.env.JWT_SECRET_REFRESH,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    const expiresIn = extractExpiryDate(refreshToken);
    const createdRefToken = await Token.create({
        token: refreshToken,
        type: "REFRESH",
        expiresIn: expiresIn,
        createdBy: user._id
    });
    return { token: createdRefToken.token, expiresIn };
};

function extractExpiryDate(jwtToken) {
    try {
        const decodedToken = jwt.decode(jwtToken, { complete: true });
        if (decodedToken && decodedToken.payload && decodedToken.payload.exp) {
            const expiryTimestamp = decodedToken.payload.exp;
            return new Date(expiryTimestamp * 1000);
        }
    } catch (err) {
        errorHandler.SendError(res, err);
    }
    return null;
}

exports.generateRefreshToken = generateRefreshToken;
exports.generateAccessToken = generateAccessToken;
