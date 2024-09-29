const HistoricalPlace = require("../models/HistoricalPlace/HistoricalPlaces");

const errorHandler = require("../Util/ErrorHandler/errorSender");

exports.getHistoricalPlaces = async (req, res, next) => {
    try {
        const historicalPlaces = await HistoricalPlace.find({isActive: true})
            .populate('tags');
        if(historicalPlaces.length === 0) {
            return res.status(404).json({ message: 'No historical places found' });
        }
        res.status(200).json(historicalPlaces);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getHistoricalPlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const historicalPlace = await HistoricalPlace.findOne({ _id: id, isActive: true }).populate('Tag');
        if (!historicalPlace) {
            return res.status(404).json({ message: 'Historical place not found or Inactive' });
        }
        res.status(200).json(historicalPlace);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getMyHistoricalPlaces = async (req, res, next) => {
    try {
        // req.user = { _id: '66f6564440ed4375b2abcdfb' };
        const createdBy = req.user._id;
        const historicalPlaces = await HistoricalPlace.find({ createdBy }).populate('Tag');
        if(historicalPlaces.length === 0) {
            return res.status(404).json({ message: 'No historical places found' });
        }
        res.status(200).json( historicalPlaces );
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}
// will be completed later . There is no date field in the model
exports.getUpcomingHistoricalPlaces = async (req, res, next) => {

}



exports.createHistoricalPlace = async (req, res, next) => {
    try {
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















