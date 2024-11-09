const BrevoTemplate = require("../model/BrevoTemplate");

//Done
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
            price: this.price,
            userName: this.userName
        };
    }
}

module.exports = FlaggedItineraryTemplate;