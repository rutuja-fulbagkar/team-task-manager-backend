import mongoose from "mongoose";

const taskActivitySchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },  
    description: { type: String },              
  },
  { timestamps: true }
);

export default mongoose.model("TaskActivity", taskActivitySchema);
