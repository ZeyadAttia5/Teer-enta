const mongoose = require('mongoose') ;

const currencySchema = new mongoose.Schema({
    name:{type:String , required:true} ,
    code:{type:String , required:true} ,
    rate:{type:Number , required:true}
} , {timestamps:true})

module.exports = mongoose.model('Currency' , currencySchema) ;