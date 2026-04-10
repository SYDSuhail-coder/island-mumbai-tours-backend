const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
    base: {
        type: String,
        required: true,
        index: true
    },
    rates: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { strict: false });

module.exports = mongoose.model("rates", currencySchema);