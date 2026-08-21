import AuditLog from "../models/auditLog.model.js";

export const writeAuditLog = async (
  req,
  { action, targetType, targetId, metadata = {} },
) => {
  if (!req.user?._id) return;

  await AuditLog.create({
    actor: req.user._id,
    action,
    targetType,
    targetId,
    metadata,
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  });
};
