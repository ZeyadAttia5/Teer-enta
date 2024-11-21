const PromoCode = require('../models/PromoCodes');
const errorHandler = require('../Util/ErrorHandler/errorSender');
const {generateRandomCode} = require("../Util/promoCodeGenerator");
const PromoCodes = require("../models/PromoCodes");

exports.getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.find();
        res.status(200).json({ promoCodes });
    } catch (err) {
        errorHandler.SendError(res, err);
}

exports.createPromoCode = async (req, res) => {
    try {
        const { discount, expiryDate, usageLimit } = req.body;

        if (!discount || !expiryDate) {
            return res.status(400).json({ message: 'Discount and expiry date are required' });
        }

        let code;
        const maxRetries = 5;
        let retries = 0;

        while (retries < maxRetries) {
            code = generateRandomCode();
            const existingPromo = await PromoCode.findOne({ code });

            if (!existingPromo) break;  // Unique code found, exit loop

            retries++;
        }

        if (retries === maxRetries) {
            return res.status(500).json({ message: 'Failed to generate a unique promo code. Please try again.' });
        }

        const newPromoCode = await PromoCode.create({
            code,
            discount,
            expiryDate: new Date(expiryDate),
            usageLimit: usageLimit || 1,
        });

        res.status(201).json({ message: 'Promo code created successfully', promoCode: newPromoCode });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.applyPromoCode = async (req, res) => {
    try {
        const {promoCode} = req.body;

        let existingPromoCode;
        if (promoCode) {
            existingPromoCode = await PromoCodes.findOne({
                code: promoCode,
                expiryDate: {$gt: Date.now()} // Ensure the expiry date is in the future
            });
            if (!existingPromoCode) {
                return res.status(400).json({message: "Invalid or expired Promo Code"});
            }
            if (existingPromoCode.usageLimit <= 0) {
                return res.status(400).json({message: "Promo Code usage limit exceeded"});
            }
        }

        res.status(200).json({message: "Promo Code applied successfully", promoCode: existingPromoCode.discount});
    }catch (err) {
        errorHandler.SendError(res, err);
    }
}