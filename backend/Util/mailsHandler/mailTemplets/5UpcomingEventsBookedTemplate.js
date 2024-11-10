const BrevoTemplate = require("../model/BrevoTemplate");

class UpcomingEventsBookedTemplate extends BrevoTemplate {
    // name of event and date of event and user name
    constructor(name ,userName ,date ,url) {
        super();
        this.name = name;
        this.userName = userName;
        this.date = date;
        this.url = url ;
    }

    template() {
        return 5 ;
    }

    params() {
        return {
            name: this.name,
            userName: this.userName,
            date: this.date ,
            url : this.url
        };
    }
}

module.exports = UpcomingEventsBookedTemplate;