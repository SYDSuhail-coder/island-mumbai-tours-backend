const mongoose = require("mongoose");

const bookingSectionSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    bookingType: {
      type: String,
      enum: ["book-now-page", "walking-tour", "private-tour", "tours"],
      required: true
    },
    tour: { type: String, required: true, trim: true },
    slug: { type: String, default: "" },
    date: { type: Date, required: true },
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    time: { type: String, default: "" },
    duration: { type: String, default: "" },
    highlights: [{ type: String }],
    timeslot: { type: String, default: "" },
    totalAmount: { type: Number, required: true },
    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    guideName: { type: String, default: "", trim: true },
    confirmedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bookingSection", bookingSectionSchema);