const BrevoTemplate = require("../model/BrevoTemplate");

class PromoCodeTemplate extends BrevoTemplate {
    constructor(code ,userName,expDate) {
        super();
        this.code = code;
        this.userName = userName;
        this.expDate = expDate;
    }

    template() {
        return 3;
    }

    params() {
        return {
            code: this.code,
            userName: this.userName,
            expDate: this.expDate
        };
    }
}

module.exports = PromoCodeTemplate;