import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Converted"],
      default: "New",
    },
    notes: {
      type: String,
      default: "",
    },
    followUp: {
      type: String, // YYYY-MM-DD
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
