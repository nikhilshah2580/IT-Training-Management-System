import AdminModulePage from "./AdminModulePage";
import {
  createJobPlacement,
  deleteJobPlacement,
  getJobPlacements,
  updateJobPlacement,
  updateJobPlacementStatus,
} from "../../api/jobPlacement.services";

const JobPlacementManagement = () => (
  <AdminModulePage
    title="Job Placement Management"
    description="Track student placements and publish placement records."
    queryKey="admin-job-placements"
    listFn={() => getJobPlacements({ limit: 100 })}
    listKeys={["placements", "jobPlacements"]}
    createFn={createJobPlacement}
    updateFn={updateJobPlacement}
    deleteFn={deleteJobPlacement}
    statusFn={updateJobPlacementStatus}
    statusOptions={[
      { value: "Pending", label: "Pending" },
      {
        value: "Placed",
        label: "Placed",
        className: "bg-green-100 text-green-700 hover:bg-green-200",
      },
      {
        value: "Joined",
        label: "Joined",
        className: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      },
      {
        value: "Resigned",
        label: "Resigned",
        className: "bg-red-100 text-red-700 hover:bg-red-200",
      },
    ]}
    createLabel="Create Placement"
    fields={[
      { name: "student", label: "Student ID", required: true },
      { name: "companyName", label: "Company", required: true },
      { name: "jobTitle", label: "Job title", required: true },
      { name: "location", label: "Location" },
      { name: "salary", label: "Salary", type: "number" },
      {
        name: "employmentType",
        label: "Employment type",
        type: "select",
        defaultValue: "Full-time",
        options: [
          "Full-time",
          "Part-time",
          "Internship",
          "Contract",
          "Remote",
        ].map((value) => ({ value, label: value })),
      },
      { name: "placementDate", label: "Placement date", type: "date" },
      { name: "joiningDate", label: "Joining date", type: "date" },
      {
        name: "status",
        label: "Status",
        type: "select",
        defaultValue: "Placed",
        options: ["Placed", "Joined", "Resigned", "Pending"].map((value) => ({
          value,
          label: value,
        })),
      },
      { name: "description", label: "Description", type: "textarea" },
    ]}
    columns={[
      {
        label: "Student",
        render: (row) =>
          row.student?.fullName || row.studentName || row.student || "-",
      },
      { label: "Company", render: (row) => row.companyName || "-" },
      { label: "Position", render: (row) => row.jobTitle || "-" },
      { label: "Status", render: (row) => row.status || "-" },
    ]}
  />
);
export default JobPlacementManagement;
