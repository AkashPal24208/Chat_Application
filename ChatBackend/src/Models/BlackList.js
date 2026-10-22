const mongoose = require('mongoose')

const blackList = new mongoose.Schema({
    token:{
        type:String,
        require:[true,"token is to be added in blackList"]
    }
},{
    timestamps: true
})

const blackListModel =  mongoose.model("BlackListToken",blackList)
module.exports = blackListModel