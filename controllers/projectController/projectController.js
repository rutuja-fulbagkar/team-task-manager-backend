import Project from "../../models/projectModels/project.js";
import User from "../../models/authModels/User.js";
import Task from "../../models/taskModules/Task.js";
import mongoose from "mongoose";

export const createProject = async (req, res) => {
  try {
    const { projectCode, name, description, startDate, endDate, dueDate } = req.body;
    if(!projectCode || !name) {
      return res.status(400).json({ message: "Project code and name are required" });
    }
    const existingProject = await Project.findOne({ projectCode });
    if (existingProject) return res.status(400).json({ message: "Project code already exists" }); 
    const project = await Project.create({
      projectCode,
      name,
      description,
      members: [{ user: req.user.id, role: "owner" }],
      createdBy: req.user.id,
      startDate,
      endDate,
      dueDate,
      status: "Pending", 
    }); 

    await project.populate("members.user", "name email");
    res.status(201).json({ success: true, message: "Project created successfully", project });

    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const updateProject = async (req, res) => {
  try {
    // 1. Find the project by ID from params
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    } 

    // 2. Check if the logged-in user (req.user.id) is the owner
    const owner = project.members.find(m => m.role === "owner");
    if (!owner || owner.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Only the owner can update the project" });
    }

    // 3. Update allowed fields only (partial update)
    const updatableFields = ["projectCode", "name", "description", "startDate", "endDate", "dueDate", "status"];
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    // 4. Save the updated project
    await project.save();

    // 5. Optional: Populate owner's user details
    await project.populate("members.user", "name email");

     res.json({ success: true, message: "Project updated successfully", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getProjects = async (req, res) => {
  try {
    const { startDate, endDate, status, q, page = 1, limit = 20, timeRange,search } = req.query;
    const filters = { "members.user": req.user.id }; // Only projects where user is a member

    // Helper function to apply timeRange filters
    function applyTimeRangeFilter(timeRangeValue) {
      const now = new Date();
      let start, end;

      switch (timeRangeValue) {
        case "currentYear":
          start = new Date(now.getFullYear(), 0, 1);
          end = new Date(now.getFullYear() + 1, 0, 1);
          break;
        case "lastMonth":
          start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          end = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "thisMonth":
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          break;
        case "lastWeek":
          {
            const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
            end = new Date(now);
            end.setDate(now.getDate() - dayOfWeek); // last Sunday
            start = new Date(end);
            start.setDate(end.getDate() - 7); // Sunday before last
          }
          break;
        case "thisWeek":
          {
            const dayOfWeek = now.getDay();
            start = new Date(now);
            start.setDate(now.getDate() - dayOfWeek); // Sunday this week
            end = new Date(start);
            end.setDate(start.getDate() + 7); // End of this week Sunday
          }
          break;
        default:
          // No timeRange filter
          return;
      }

      filters.startDate = {
        $gte: start,
        $lt: end,
      };
    }

    // Apply timeRange filter if provided (overrides startDate/endDate)
    if (timeRange) {
      applyTimeRangeFilter(timeRange);
    } else if (startDate || endDate) {
      filters.startDate = {};
      if (startDate) filters.startDate.$gte = new Date(startDate);
      if (endDate) filters.startDate.$lte = new Date(endDate);
    }

    // Apply status filter
    if (status) {
      const statusMap = {
        pending: "Pending",
        inprogress: "InProgress",
        delayed: "Delayed",
        completed: "Completed",
      };
      filters.status = statusMap[status.toLowerCase()] || status;
    }

    // Apply search filter
    if (search) {
      const regex = new RegExp(search, "i");
      filters.$or = [{ projectCode: regex }, { name: regex }, { description: regex }];
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Fetch projects and total count
    const [projects, total] = await Promise.all([
      Project.find(filters)
        .populate("members.user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Project.countDocuments(filters),
    ]);

    // Get counts for each status (pending, inprogress, delayed, completed) ignoring pagination and other filters except membership & timeRange filter
    const countsFilter = { "members.user": req.user.id };
    if (filters.startDate) countsFilter.startDate = filters.startDate;

    const [pendingCount, completedCount, inProgressCount, delayedCount, allCount] = await Promise.all([
      Project.countDocuments({ ...countsFilter, status: "Pending" }),
      Project.countDocuments({ ...countsFilter, status: "Completed" }),
      Project.countDocuments({ ...countsFilter, status: "InProgress" }),
      Project.countDocuments({ ...countsFilter, status: "Delayed" }),
      Project.countDocuments(countsFilter),
    ]);

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      projects,
      pendingCount,
      completedCount,
      inProgressCount,
      delayedCount,
      allCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllProjectsWithoutPagination = async (req, res) => {
  try {
    console.log("req.user:", req.user); // Debug log
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const filters = { "members.user": req.user._id.toString() };

    const projects = await Project.find(filters)
      .populate("members.user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: projects.length,
      projects,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("members.user", "name email");
    if (!project) return res.status(404).json({ message: "Not found" });

    const isMember = project.members.some(m => m.user.id.toString() === req.user.id.toString());
    if (!isMember) return res.status(403).json({ message: "Not authorized" });

    // Also fetch tasks under the project
    const tasks = await Task.find({ project: project.id }).populate("assignee", "name email");
    res.json({ success: true, project, tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });

    const user = project.members.find(m => m.role === "owner");
    if (!user || user.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Only the owner can delete" });
    }

    // Delete tasks under project too (cleanup)
    await Task.deleteMany({ project: project.id });
    await project.deleteOne();
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add member (owner only)
export const addMember = async (req, res) => {
  try {
    const { userId, role = "member" } = req.body;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Valid userId required" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });

    const owner = project.members.find(m => m.role === "owner");
    if (!owner || owner.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Only the owner can add members" });
    }

    if (project.members.some(m => m.user.toString() === userId)) {
      return res.status(400).json({ message: "User  already a member" });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User  not found" });

    project.members.push({ user: userId, role });
    await project.save();
    await project.populate("members.user", "name email");
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
