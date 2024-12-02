const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: String,
    body: String,
    tokens: [String],
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'failed'], default: 'sent' } ,
    sentTo:{type:mongoose.Schema.Types.ObjectId , ref:'User' , required:true} ,
    isSeen:{type:Boolean , default:false}
});

module.exports = mongoose.model('Notification', notificationSchema);