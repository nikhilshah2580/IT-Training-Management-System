import mongoose from "mongoose";
import JobApplication from "../models/jobApplication.model.js";
import JobListing from "../models/jobListing.model.js";

export const createJobApplicationService = async (data) => {
  const { job, name, email, phone, resumeFile, resumeName, coverNote } = data;
  if (!mongoose.Types.ObjectId.isValid(job)) {
    const error = new Error("Invalid job listing ID");
    error.statusCode = 400;
    throw error;
  }
  const jobListing = await JobListing.findOne({ _id: job, status: "Published" });
  if (!jobListing) {
    const error = new Error("Job listing is not available");
    error.statusCode = 404;
    throw error;
  }
  return JobApplication.create({
    job,
    name,
    email,
    phone,
    resumeFile,
    resumeName,
    coverNote,
  });
};

export const getJobApplicationsService = async ({ search, status } = {}) => {
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }
  return JobApplication.find(filter)
    .populate("job", "title companyName")
    .sort({ createdAt: -1 });
};

export const updateJobApplicationStatusService = async (id, status) =>
  JobApplication.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: "after", runValidators: true },
  ).populate("job", "title companyName");

export const deleteJobApplicationService = async (id) =>
  JobApplication.findByIdAndDelete(id);