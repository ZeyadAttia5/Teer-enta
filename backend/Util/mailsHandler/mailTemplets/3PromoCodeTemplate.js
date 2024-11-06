const BrevoTemplate = require("../model/BrevoTemplate");

class PromoCodeTemplate extends BrevoTemplate {
    constructor(code ,userName) {
        super();
        this.code = code;
        this.userName = userName;
    }

    template() {
        return 3;
    }

    params() {
        return {
            code: this.code,
            userName: this.userName,
        };
    }
}