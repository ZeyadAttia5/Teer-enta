const mongoose = require('mongoose');

const PreferenceTagsSchema = new mongoose.Schema({
    tag: {type: String, required: true} ,
    isActive: {type: Boolean, default: true} ,
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'} // Admin
}, {timestamps: true});

module.exports = mongoose.model('PreferenceTags', PreferenceTagsSchema);
