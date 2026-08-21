import AdminModulePage from "./AdminModulePage";
import {
  createJobListing,
  deleteJobListing,
  getJobListings,
  updateJobListing,
  updateJobListingStatus,
} from "../../api/jobListing.services";

const JobManagement = () => (
  <AdminModulePage
    title="Job Management"
    description="Create and manage job listings shown to students."
    queryKey="admin-jobs"
    listFn={() => getJobListings({ limit: 100 })}
    listKeys={["jobs", "jobListings"]}
    createFn={createJobListing}
    updateFn={updateJobListing}
    deleteFn={deleteJobListing}
    statusFn={updateJobListingStatus}
    statusOptions={[
      {
        value: "Published",
        label: "Publish",
        className: "bg-green-100 text-green-700 hover:bg-green-200",
      },
      { value: "Closed", label: "Close" },
      { value: "Draft", label: "Draft" },
    ]}
    createLabel="Create Job"
    fields={[
      { name: "title", label: "Job title", required: true },
      { name: "companyName", label: "Company", required: true },
      { name: "location", label: "Location" },
      {
        name: "employmentType",
        label: "Employment type",
        type: "select",
        defaultValue: "Full Time",
        options: ["Full Time", "Part Time", "Internship", "Contract"].map(
          (value) => ({ value, label: value }),
        ),
      },
      {
        name: "applicationDeadline",
        label: "Application deadline",
        type: "date",
        required: true,
      },
      { name: "applicationUrl", label: "Application URL" },
      {
        name: "status",
        label: "Status",
        type: "select",
        defaultValue: "Draft",
        options: ["Draft", "Published", "Closed", "Expired"].map((value) => ({
          value,
          label: value,
        })),
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      {
        name: "requirements",
        label: "Requirements, one per line",
        type: "textarea",
        transform: (value) =>
          String(value || "")
            .split(/\r?\n|,/)
            .map((item) => item.trim())
            .filter(Boolean),
        read: (row) =>
          Array.isArray(row.requirements)
            ? row.requirements.join("\n")
            : row.requirements,
      },
    ]}
    columns={[
      { label: "Title", render: (row) => row.title || "-" },
      { label: "Company", render: (row) => row.companyName || "-" },
      { label: "Location", render: (row) => row.location || "-" },
      { label: "Status", render: (row) => row.status || "-" },
    ]}
  />
);
export default JobManagement;
