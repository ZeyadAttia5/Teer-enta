const Tourist = require('../models/Users/Tourist');
const User = require("../models/Users/User");

exports.signup = async (req, res) => {
    const { email, username, password, userType, profileData } = req.body;

    try {
        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).send({ message: "Email already exists" });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).send({ message: "Username already exists" });
        }

        // Encrypt the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user with the hashed password
        const user = new User({
            email,
            username,
            password: hashedPassword, // Store hashed password
            userType
        });

        await user.save();

        // Create the corresponding profile based on userType
        if (userType === 'Tourist') {
            const profile = new Tourist({ user: user._id, ...profileData });
            await profile.save();
            return res.status(201).send({ user, profile });
        }

        res.status(201).send({ user });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
};