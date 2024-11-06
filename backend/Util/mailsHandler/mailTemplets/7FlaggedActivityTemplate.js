const BrevoTemplate = require("../model/BrevoTemplate");

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
            url: this.url,
            userName: this.userName
        };
    }

}