const mongoose = require("mongoose");

const adminLoginSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    isDeleted: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
    },
    roleId: {
        type: Number,
    },

}, { statics: false });

const LoginUser = mongoose.model('adminLogin', adminLoginSchema);

module.exports = LoginUser;