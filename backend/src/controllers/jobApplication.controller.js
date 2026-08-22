import {
  createJobApplicationService,
  getJobApplicationsService,
  updateJobApplicationStatusService,
  deleteJobApplicationService,
} from "../services/jobApplication.service.js";
import { notifyAdmins } from "../utils/notificationEvents.js";
import fs from "fs";
import path from "path";

export const createJobApplication = async (req, res) => {
  if (!req.file) {
    const error = new Error("Resume is required");
    error.statusCode = 400;
    throw error;
  }
  const application = await createJobApplicationService({
    ...req.body,
    resumeFile: req.file.path,
    resumeName: req.file.originalname,
  });
  await notifyAdmins({
    title: "New job application",
    message: `${application.name} applied for a job.`,
    type: "job",
    referenceId: application._id,
    referenceModel: "JobApplication",
  });
  return res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    application,
  });
};

export const getJobApplications = async (req, res) =>
  res.json({
    success: true,
    applications: await getJobApplicationsService(req.query),
  });

export const updateJobApplicationStatus = async (req, res) =>
  res.json({
    success: true,
    message: "Application status updated",
    application: await updateJobApplicationStatusService(
      req.params.id,
      req.body.status,
    ),
  });

export const deleteJobApplication = async (req, res) => {
  await deleteJobApplicationService(req.params.id);
  res.json({ success: true, message: "Application deleted successfully" });
};

export const downloadJobApplicationResume = async (req, res) => {
  const application = await getJobApplicationsService({});
  const match = application.find((item) => item._id.toString() === req.params.id);
  if (!match || !match.resumeFile || !fs.existsSync(match.resumeFile)) {
    return res.status(404).json({ success: false, message: "Resume not found" });
  }
  return res.download(path.resolve(match.resumeFile), match.resumeName || "resume");
};