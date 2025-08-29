export const isProjectMember = (project) => {
  return (req, res, next) => {
    const isMember = project.members.some(m => m.user.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ message: "Only project members allowed" });
    next();
  };
};