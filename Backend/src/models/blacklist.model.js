const mongoose = require("mongoose");
const { applyTimestamps } = require("./user.model");

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
} , {
    timestamps:true });

const tokenBlackListModel = mongoose.model("BlackListToken", blackListTokenSchema);

module.exports = tokenBlackListModel;