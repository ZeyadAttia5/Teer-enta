const BrevoTemplate = require("../model/BrevoTemplate");

class PaymentReceiptItemTemplate extends BrevoTemplate {
    // text is the data related to what i paid for (event  or itineraries)
    constructor(userName ,amount ,date ,text) {
        super();
        this.userName = userName;
        this.amount = amount;
        this.date = date;
        this.text = text;
    }

    template() {
        return 2 ;
    }

    params() {
        return {
            userName: this.userName,
            amount: this.amount,
            date: this.date,
            text: this.text
        };
    }
}