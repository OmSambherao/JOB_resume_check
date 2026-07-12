const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique :[true , ' user with this name already exist '], 
        required: true,
    },
    email: {
        type: String,
        required: true,
         unique :[true , ' user with this email already exist '], 
    }, 
    password: {
        type: String,
        required: true,
    },  
})

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel ;