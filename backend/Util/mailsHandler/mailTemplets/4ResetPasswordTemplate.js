const BrevoTemplate = require("../model/BrevoTemplate");

class ResetPasswordTemplate extends BrevoTemplate {
    constructor(OTP ,userName) {
        super();
        this.OTP = OTP;
        this.userName = userName;
    }

    template() {
        return 4;
    }

    params() {
        return {
            OTP: this.OTP,
            userName: this.userName,
        };
    }
}

module.exports = ResetPasswordTemplate;