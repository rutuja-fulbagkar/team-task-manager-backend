import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  title: { type: String, required: true },
  description: { type: String },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dueDate: { type: Date },
   status: { type: String, enum: ["Pending","InProgress","Delayed","Completed"], default: "Pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);


