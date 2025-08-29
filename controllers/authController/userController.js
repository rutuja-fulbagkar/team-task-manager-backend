import User from "../../models/authModels/User.js";
 

export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users with selected fields (exclude sensitive fields like password, OTP)
    const users = await User.find({}, "name email role createdAt updatedAt").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
       message: "Users retrieved successfully.",
      total: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
