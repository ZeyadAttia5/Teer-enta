const cron = require('node-cron');
const moment = require('moment');
const BookedActivity = require('../models/Booking/BookedActivitie');  // Your BookedActivity model
const User = require('../models/Users/User');
const BrevoService = require("../Util/mailsHandler/brevo/brevoService");
const brevoConfig = require("../Util/mailsHandler/brevo/brevoConfig");
const brevoService = new BrevoService(brevoConfig);
const UpcomingEventTemplate = require("../Util/mailsHandler/mailTemplets/5UpcomingEventsBookedTemplate");

// TODO: Not tested yet
cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Checking for reminders for upcoming Booked events 5 days ahead');

        const currentDate = moment().startOf('day');

        const bookedActivities = await BookedActivity.find({
            isActive: true,
            status: 'Pending'
        }).populate('activity').populate('createdBy');

        if (bookedActivities.length === 0) {
            console.log('No bookings found for reminder today.');
        }

        for (let booking of bookedActivities) {
            const activity = booking.activity;
            const user = booking.createdBy;

            const activityDate = moment(activity.date);
            const daysDifference = activityDate.diff(currentDate, 'days');

            if (daysDifference === 5) {
                if (user && user.email) {
                    const emailParams = {
                        name: activity.name,
                        userName: user.username,
                        date: moment(activity.date).format('MMMM Do YYYY'),
                    };

                    const emailTemplate = new UpcomingEventTemplate(
                        emailParams.name,
                        emailParams.userName,
                        emailParams.date,
                        `${process.env.FRONTEND_HOST}/itinerary/activityDetails/${activity._id}`
                    );

                    await brevoService.send(emailTemplate, user.email);
                    console.log(`Reminder sent to ${user.email} for activity ${activity.name}`);
                }
            }
        }

        console.log('Checked all bookings for reminders!');
    } catch (error) {
        console.error('Error sending reminders:', error);
    }
});
