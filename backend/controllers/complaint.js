const Complaint = require("../models/Complain");
const errorHandler = require("../Util/ErrorHandler/errorSender");
const User = require("../models/Users/userModels");

// TODO: Q: Does user have to be a tourist to file a complaint?
exports.fileComplaint = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: 'Tourist not found'});
        }

        if(user.userRole !== 'Tourist'){
            return res.status(400).json({ message: 'Invalid or unsupported user role' });
        }

        const complaint = req.body;
        await Complaint.create({
            ...complaint,
            date: new Date(),
            createdBy: userId,
            status: 'Pending',
            reply: null
        });
        res.status(200).json({message: 'Complaint filed successfully'});
    } catch(err) {
        errorHandler.SendError(res, err);
    }
}