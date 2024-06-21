import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
});

const ImageModel = mongoose.model("Images", imageSchema);

export default ImageModel;
