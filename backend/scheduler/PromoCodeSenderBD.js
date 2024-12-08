const cron = require('node-cron');
const { generateRandomCode } = require('../Util/promoCodeGenerator');
const User = require('../models/Users/User');
const PromoCode = require('../models/PromoCodes');
const BrevoService = require("../Util/mailsHandler/brevo/brevoService");
const brevoConfig = require("../Util/mailsHandler/brevo/brevoConfig");
const brevoService = new BrevoService(brevoConfig);
const PromoCodeTemplate = require("../Util/mailsHandler/mailTemplets/3PromoCodeTemplate");
const moment = require('moment-timezone'); // Import moment-timezone
// */1 * * * *
// Receive a Promo code on my birthday that can be used on anything in the website by email and on the system
cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Sending promo codes to tourists for their birthdays');


        const today = moment.utc();
        const todayMonth = today.month(); // 0-11
        const todayDate = today.date();   // 1-31

        const users = await User.find({
            userRole: 'Tourist',
            $expr: {
                $and: [
                    { $eq: [{ $month: '$dateOfBirth' }, todayMonth + 1] },  // MongoDB months are 1-12
                    { $eq: [{ $dayOfMonth: '$dateOfBirth' }, todayDate] }
                ]
            }
        });

        if (users.length === 0) {
            console.log('No users with birthdays today.');
            return;
        }

        for (const user of users) {
            console.log(`Sending promo code to ${user.username} (${user.email})`);
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
