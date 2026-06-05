const mongoose = require("mongoose");

const bookingSectionSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    tour: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    duration: { type: String, default: "" },
    highlights: [{ type: String }],
    timeslot: { type: String, default: "" },
    totalAmount: { type: Number, required: true },
    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("bookingSection", bookingSectionSchema);