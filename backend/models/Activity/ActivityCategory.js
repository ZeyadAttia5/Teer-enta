const mongoose = require('mongoose');

const ActivityCategorySchema = new mongoose.Schema({
    category: { type: String, required: true, unique: true },
    description: String ,
    isActive: { type: Boolean, default: true } ,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{ timestamps: true });

module.exports = mongoose.model('ActivityCategory', ActivityCategorySchema);
