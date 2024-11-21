const mongoose = require('mongoose') ;

const notificationRequestSchema = new mongoose.Schema({
    activity:{type:mongoose.Schema.Types.ObjectId , ref:'Activity' , required:true} ,
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    createdBy:{type:mongoose.Schema.Types.ObjectId , ref:'User' , required:true} ,
} , {timestamps:true})

module.exports = mongoose.model('NotificationRequest' , notificationRequestSchema) ;
