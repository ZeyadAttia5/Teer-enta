const BrevoTemplate = require("../model/BrevoTemplate");

//Done
class FlaggedActivityTemplate extends BrevoTemplate {
    constructor(name , price ,userName) {
        super();
        this.name = name;
        this.price = price;
        this.userName = userName;
    }

    template() {
        return 7;
    }

    params() {
        return {
            name: this.name,
            price: this.price,
            userName: this.userName
        };
    }

}

module.exports = FlaggedActivityTemplate;