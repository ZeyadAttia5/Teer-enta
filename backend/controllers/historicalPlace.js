const HistoricalPlace = require("../models/HistoricalPlace/HistoricalPlaces");

const errorHandler = require("../Util/HandleErrors");

exports.getHistoricalPlaces = async (req, res, next) => {
    try {
        const historicalPlaces = await HistoricalPlace.find();
        if(historicalPlaces.length === 0) {
            return res.status(404).json({ message: 'No historical places found' });
        }
        res.status(200).json({ historicalPlaces });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.createHistoricalPlace = async (req, res, next) => {
    try {
        // req.user = { _id: '66f6564440ed4375b2abcdfb' };
        const createdBy = req.user._id;
        req.body.createdBy = createdBy;

        const historicalPlace = await HistoricalPlace.create(req.body);
        res.status(201).json({ message: 'Historical Place created successfully', historicalPlace });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.updateHistoricalPlace = async (req, res, next) => {
    try {
        const { id } = req.params;


        const updates = req.body;

        const updatedHistoricalPlace = await HistoricalPlace.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true, overwrite: false }
        );

        if (!updatedHistoricalPlace) {
            return res.status(404).json({ message: 'Historical place not found' });
        }

        res.status(200).json({
            message: 'Historical place updated successfully',
            data: updatedHistoricalPlace,
        });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.deleteHistoricalPlace = async (req, res, next) => {
    try {
        const {id} = req.params;

        const historicalPlace = await HistoricalPlace.findById(id);
        if (!historicalPlace) {
            return res.status(404).json({message: 'Historical place not found'});
        }
        await HistoricalPlace.findByIdAndDelete(id);
        res.status(200).json({message: 'Historical place deleted successfully' , data: historicalPlace});
    }catch (err){
        errorHandler.SendError(res, err);
    }
}















