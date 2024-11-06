const BrevoTemplate = require("../model/BrevoTemplate");

class UpcomingEventsBookedTemplate extends BrevoTemplate {
    constructor(name ,userName ,date) {
        super();
        this.name = name;
        this.userName = userName;
        this.date = date;
    }

    template() {
        return 5 ;
    }

    params() {
        return {
            name: this.name,
            userName: this.userName,
            date: this.date
        };
    }
}