import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  isActive: {
    type: Boolean,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
});

export const bannerModel = mongoose.model("banners", bannerSchema);
