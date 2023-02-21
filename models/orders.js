
let mongoose = require("mongoose");

const OrderScheema = new mongoose.Schema({
    amount:{
        type:Number
    },
    currency:{
        type:String
    },
    status:{
        type:String
    },
    shopId:{
      type:String
    }
})
module.exports= mongoose.model('Order',OrderScheema)