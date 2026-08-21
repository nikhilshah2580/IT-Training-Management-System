import AuditLog from "../models/auditLog.model.js";

export const getAuditLogs = async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const { action, targetType, search } = req.query;

  const filter = {};
  if (action) filter.action = action;
  if (targetType) filter.targetType = targetType;
  if (search) {
    filter.$or = [
      { action: { $regex: search, $options: "i" } },
      { targetType: { $regex: search, $options: "i" } },
    ];
  }

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate("actor", "fullName email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    AuditLog.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  });
};
