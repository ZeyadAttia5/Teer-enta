const TouristProfile = require('../../models/Tourist');
const User = require('../../models/User');
const mongoose = require('mongoose')

exports.updateTourist = async (req, res, next) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({message: 'Invalid user ID'});
        }
        const {email, username, wallet, mobileNumber, nationality, dateOfBirth, occupation} = req.body;

        const emailExists = await User.findOne({email:email});
        if (emailExists){
            return res.status(400).json({message: 'Email already exists'})
        }
        const usernameExists = await User.findOne({username:username});
        if (usernameExists){
            return res.status(400).json({message: 'Username already exists'})
        }


        // Find and update the User document
        const updatedUser = await User.findByIdAndUpdate(userId, {
            email,
            username,
            wallet
        });

        // If user is not found, return an error
        if (!updatedUser) {
            return res.status(404).json({message: 'User not found'});
        }

        // Check if the user is a tourist and update TouristProfile
        if (updatedUser.userType === 'Tourist') {
            const updatedTouristProfile = await TouristProfile.findOneAndUpdate(
                {user: userId},
                {
                    mobileNumber,
                    nationality,
                    dateOfBirth,
                    occupation
                }
            );

            if (!updatedTouristProfile) {
                return res.status(404).json({message: 'Tourist profile not found'});
            }

            return res.status(200).json({
                message: 'User and Tourist TouristProfile updated successfully',
                user: updatedUser,
                touristProfile: updatedTouristProfile
            });
        } else {
            return res.status(200).json({
                message: 'User updated successfully',
                user: updatedUser
            });
        }

    } catch (error) {
        return res.status(500).json({message: 'Server error'});
    }
};

exports.getTouristProfile = async (req, res) => {
    try{
        const userId = req.params.id ;
        if (!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).send({message: 'Invalid user id'})
        }
        const user = await User.findById(userId).populate('touristProfile');
        if (!user){
            return res.status(404).send({message: 'User not found'})
        }
        return res.status(200).send(user.touristProfile) ;
    }catch (err){
        return res.status(500).send({message:err})
    }
}


