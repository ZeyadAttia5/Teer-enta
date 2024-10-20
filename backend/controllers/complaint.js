const Complaint = require("../models/Complain");
const errorHandler = require("../Util/ErrorHandler/errorSender");
const User = require("../models/Users/userModels");

exports.getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find();
        if(complaints.length === 0){
            return res.status(404).json({message: 'No complaints found'});
        }
        res.status(200).json(complaints);
    } catch(err) {
        errorHandler.SendError(res, err);
    }
}
exports.getMyComplaints = async (req, res) => {
    try {
        const userId = req.user._id;
        const complaints = await Complaint.find({createdBy: userId});
        if (complaints.length === 0) {
            return res.status(404).json({message: 'No complaints found'});
        }
        res.status(200).json(complaints);
    }catch (err) {
        errorHandler.SendError(res,err)
    }
}

exports.getComplaint = async (req, res) => {
    try {
        const complaintId = req.params.id;
        const complaint = await Complaint.findById(complaintId);
        if(!complaint){
            return res.status(404).json({message: 'Complaint not found'});
        }
        res.status(200).json(complaint);
    } catch(err) {
        errorHandler.SendError(res, err);
    }
}

exports.updateComplaint = async (req, res) => {
    try {
        const complaintId = req.params.id;
        const complaint = await Complaint.findById(complaintId);
        if(!complaint){
            return res.status(404).json({message: 'Complaint not found'});
        }
        await Complaint.findByIdAndUpdate(complaintId, req.body);
        res.status(200).json({message: 'Complaint updated successfully'});
    } catch(err) {
        errorHandler.SendError(res, err);
    }
}


exports.createComplaint = async (req, res) => {
    try {
        const complaint = req.body;
        await Complaint.create({
            ...complaint,
            date: new Date(),
            status: 'Pending',
            reply: null
        });
        res.status(200).json({message: 'Complaint created successfully'});
    } catch(err) {
        errorHandler.SendError(res, err);
    }
}