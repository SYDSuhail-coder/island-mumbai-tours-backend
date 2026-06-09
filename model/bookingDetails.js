const mongoose = require("mongoose");

const bookingDetailsSchema = new mongoose.Schema({
    tourName: { type: String, required: true, unique: true, trim: true },
    adultPrice: { type: Number, required: true },
    childPrice: { type: Number, required: true },
    duration: [{ type: String, required: true }],
    highlights: [{ type: String }],
    timeslots: [{ type: String }],
    bookingType: {type: String,
        default: "book-now-page"
    },
}, { timestamps: true });

module.exports = mongoose.model("BookingDetails", bookingDetailsSchema);