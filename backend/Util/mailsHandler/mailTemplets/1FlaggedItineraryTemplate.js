const BrevoTemplate = require("../model/BrevoTemplate");

class FlaggedItineraryTemplate extends BrevoTemplate {
    constructor(name , price ,userName) {
        super();
        this.name = name;
        this.price = price;
        this.userName = userName;
    }

    template() {
        return 1;
    }

    params() {
        return {
            name: this.name,
            url: this.url,
            userName: this.userName
        };
    }
}