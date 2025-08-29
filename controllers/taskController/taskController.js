import Project from "../../models/projectModels/project.js";
import Task from "../../models/taskModules/Task.js";
import TaskActivity from "../../models/taskModules/TaskActivity.js";

// Create task under project -> only project members
export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, assignee, dueDate, status } = req.body;
console.log("rutujhajhsjahsj",req.user);

    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Unauthorized: User ID missing" });

    const project = await Project.findById(projectId).populate("members.user");
    if (!project) return res.status(404).json({ message: "Project not found" });

    // only members can create
    const isMember = project.members.some(m => {
      const userId = m.user.id ? m.user.id : m.user;
      return userId.toString() === req.user.id.toString();
    });
    if (!isMember)
      return res.status(403).json({ message: "Only project members allowed" });

    // optional: check assignee is a project member
    if (assignee && !project.members.some(m => {
      const userId = m.user.id ? m.user.id : m.user;
      return userId.toString() === assignee.toString();
    })) {
      return res.status(400).json({ message: "Assignee must be a project member" });
    }

    const task = await Task.create({
      project: projectId,
      title,
      description,
      assignee,
      dueDate,
      status,
      createdBy: req.user.id,
    });

    // Create task creation activity log
    await TaskActivity.create({
      task: task._id,
      user: req.user.id,
      action: "created",
      description: `Task "${title}" was created`,
    });

    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get tasks by project (for Kanban board)
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isMember = project.members.some(
      (m) => m.user.toString() === req.user.id.toString()
    );
    if (!isMember)
      return res.status(403).json({ message: "Only project members allowed" });

    const tasks = await Task.find({ project: projectId })
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params; 
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isMember = project.members.some(m => m.user.toString() === req.user.id.toString());
    if (!isMember) return res.status(403).json({ message: "Only project members allowed" });

    const up = ["title","description","assignee","dueDate","status"];
    up.forEach(k => {
      if (req.body[k] !== undefined) task[k] = req.body[k];
    });

    await task.save();
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Delete task (only members)
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isMember = project.members.some(m => m.user.toString() === req.user.id.toString());
    if (!isMember) return res.status(403).json({ message: "Only project members allowed" });

    await task.deleteOne();
    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getTaskActivities = async (req, res) => {
  try {
    const { taskId } = req.params;
    const activities = await TaskActivity.find({ task: taskId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, activities });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

