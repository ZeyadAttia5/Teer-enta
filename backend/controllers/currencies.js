const errorHandler = require("../Util/ErrorHandler/errorSender");
const Currency = require('../models/Currency')
const User = require('../models/Users/User');

exports.getAllCurrencies = async (req, res) => {
    try {
        const currencies = await Currency.find() ;
        res.status(200).json(currencies) ;
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getMyCurrency = async (req, res) => {
    try {
        if (!req.user)
            return res.status(200).json({rate: 1, code: 'EGP' , name:'Egyptian Pound'});
        const userId = req.user._id;
        const user = await User.findById(userId).populate('currency');
        if (!user.currency)
            return res.status(200).json({rate: 1, code: 'EGP' , name:'Egyptian Pound'});
        const currency = user.currency;
        return res.status(200).json({rate: currency.rate, code: currency.code});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}


exports.addCurrency = async (req, res) => {
    try {
        const currency = new Currency(req.body);
        await currency.save();
        return res.status(201).json({message: 'currency saved successfully' , currency:currency});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.addMultipleCurrencies = async (req, res) => {
    try {
        const currencies = req.body;
        const insertedCurrencies = await Currency.insertMany(currencies, { ordered: false });
        res.status(201).json({
            message: `${insertedCurrencies.length} currencies added successfully.`,
            data: insertedCurrencies,
        });
    } catch (error) {
        errorHandler.SendError(res,err) ;
    }
};

exports.deleteAllCurrencies = async (req,res)=>{
    try{
        const currencies = await Currency.deleteMany() ;
        return res.status(200).json({message:'currencies deleted successfully'})
    }catch (err){
        errorHandler.SendError(res,err) ;
    }
}


