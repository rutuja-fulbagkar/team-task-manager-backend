import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectCode: { type: String, required: true, unique: true, trim: true },  
  name: { type: String, required: true, trim: true },                     
  description: { type: String, trim: true },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["owner","member"], default: "member" }
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  dueDate: { type: Date },  
  status: { type: String, enum: ["Pending","InProgress","Delayed","Completed"], default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
