const BrevoTemplate = require("../model/BrevoTemplate");

//Done
class ProductOutOfStockTemplate extends BrevoTemplate {
    constructor(name , price,description ,userName) {
        super();
        this.name = name;
        this.price = price;
        this.description = description;
        this.userName = userName;
    }

    template() {
        return 6;
    }

    params() {
        return {
            name: this.name,
            price: this.price,
            description: this.description,
            userName: this.userName
        };
    }
}

module.exports = ProductOutOfStockTemplate;