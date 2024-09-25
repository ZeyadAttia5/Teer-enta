const mongoose = require('mongoose');

const PreferenceTagsSchema = new mongoose.Schema({
    name: {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model('PreferenceTags', PreferenceTagsSchema);
