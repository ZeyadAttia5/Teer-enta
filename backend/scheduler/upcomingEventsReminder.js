const cron = require('node-cron');
const moment = require('moment');
const BookedActivity = require('../models/Booking/BookedActivitie');  // Your BookedActivity model
const User = require('../models/Users/User');
const BrevoService = require("../Util/mailsHandler/brevo/brevoService");
const brevoConfig = require("../Util/mailsHandler/brevo/brevoConfig");
const brevoService = new BrevoService(brevoConfig);
const UpcomingEventTemplate = require("../Util/mailsHandler/mailTemplets/5UpcomingEventsBookedTemplate");

// Define the Cron job to run once per day
cron.schedule('0 0 * * *', async () => {
    try {
        // Get current date and calculate the date 5 days ahead
        const currentDate = moment().startOf('day');
        const reminderDate = moment().add(5, 'days').startOf('day');

        // Find booked activities that are scheduled for 5 days from now
        const bookedActivities = await BookedActivity.find({
            date: reminderDate.toDate(),
            isActive: true,
            status: 'Pending'  // Only consider activities that are pending
        }).populate('activity').populate('createdBy');


        for (let booking of bookedActivities) {
            const activity = booking.activity;
            const user = booking.createdBy;

            if (user.email) {
                const emailParams = {
                    name: activity.name,
                    userName: user.username,
                    date: moment(activity.date).format('MMMM Do YYYY'),
                };
                const emailTemplate = new UpcomingEventTemplate(emailParams.name, emailParams.userName, emailParams.date);
                await brevoService.send(user.email, emailTemplate);
            }
        }
    } catch (error) {
        console.error('Error sending reminders:', error);
    }
});

