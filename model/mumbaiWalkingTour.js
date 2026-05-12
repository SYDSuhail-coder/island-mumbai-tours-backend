const mongoose = require("mongoose");

const mumbaiWalkingTourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },

    coverImage: {
      type: String,
      default: ""
    },

    images: {
      type: [String],
      default: []
    },

    description: {
      type: String,
      required: true
    },

    duration: {
      type: String,
      required: true
    },

    transport: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    maxGuests: {
      type: Number,
      default: 10
    },

    pricePerPerson: {
      type: Number,
      required: true
    },

    freeCancellation: {
      type: Boolean,
      default: false
    },

    rating: {
      type: Number,
      default: 0
    },

    reviewsCount: {
      type: Number,
      default: 0
    },

    badge: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// slug auto-generate
mumbaiWalkingTourSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }
  next();
});

const tour = mongoose.model("Walking-Tours", mumbaiWalkingTourSchema);
module.exports = tour;