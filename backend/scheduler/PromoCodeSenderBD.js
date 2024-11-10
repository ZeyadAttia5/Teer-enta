const cron = require('node-cron');
const { generateRandomCode } = require('../Util/promoCodeGenerator');
const User = require('../models/Users/User');
const PromoCode = require('../models/PromoCodes');
const BrevoService = require("../Util/mailsHandler/brevo/brevoService");
const brevoConfig = require("../Util/mailsHandler/brevo/brevoConfig");
const brevoService = new BrevoService(brevoConfig);
const PromoCodeTemplate = require("../Util/mailsHandler/mailTemplets/3PromoCodeTemplate");
const moment = require('moment-timezone'); // Import moment-timezone


cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Sending promo codes to tourists for their birthdays');


        const today = moment.utc();  // Current date in UTC
        const todayDate = today.date(); // Gets the day of the month (1-31)
        const todayMonth = today.month(); // Gets the month (0-11)

        console.log('Today (UTC):', today.toISOString());
       // TODO:problem to calculate the birthday
        const users = await User.find({
            userRole: 'Tourist',
            dateOfBirth: {
                $gte: moment.utc().startOf('day').toDate(),  // Start of today (midnight UTC)
                $lt: moment.utc().endOf('day').toDate()     // End of today (just before midnight UTC)
            }
        });

        if (users.length === 0) {
            console.log('No users with birthdays today.');
            return;
        }

        for (const user of users) {
            const promoCode = generateRandomCode();
            const expirationDate = moment.utc().add(7, 'days'); // Promo code expires in 7 days (UTC)


            await PromoCode.create({
                code: promoCode,
                discount: 25,
                expiryDate: expirationDate.toISOString(),
                usageLimit: 1,
            });
            const promoTemplate = new PromoCodeTemplate(
                promoCode,
                user.username,
                expirationDate.format('MMMM Do YYYY')
            );

            // Send promo code email to user
            await brevoService.send(promoTemplate,user.email);
        }

        console.log("Promo codes sent successfully!");
    } catch (error) {
        console.error("Error sending promo codes:", error);
    }
});
