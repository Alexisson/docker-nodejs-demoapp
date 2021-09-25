import mongoose from "mongoose";

const idx = new mongoose.Schema({
  id: Number,
  index: Number,
});

export default mongoose.model("dbIndex", idx);
