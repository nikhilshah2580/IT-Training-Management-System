import AdminModulePage from "./AdminModulePage";
import {
  deleteJobApplication,
  getJobApplications,
  updateJobApplicationStatus,
} from "../../api/jobApplication.services";

const JobInquiryManagement = () => (
  <AdminModulePage
    title="Job Inquiries"
    description="Review applications and resumes submitted for published jobs."
    queryKey="admin-job-applications"
    listFn={() => getJobApplications()}
    listKeys={["applications"]}
    showForm={false}
    allowEdit={false}
    deleteFn={deleteJobApplication}
    statusFn={updateJobApplicationStatus}
    statusOptions={[
      { value: "Pending", label: "Pending" },
      {
        value: "Reviewed",
        label: "Reviewed",
        className: "bg-emerald-100 text-emerald-700",
      },
      {
        value: "Rejected",
        label: "Reject",
        className: "bg-rose-100 text-rose-700",
      },
    ]}
    columns={[
      {
        label: "Applicant",
        render: (row) => (
          <div>
            <p className="font-bold">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        ),
      },
      { label: "Phone", render: (row) => row.phone || "-" },
      { label: "Job", render: (row) => row.job?.title || "-" },
      {
        label: "Resume",
        render: (row) => (
          <a
            href={`${import.meta.env.VITE_API_URL}/job-applications/${row._id}/resume`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            {row.resumeName || "Download resume"}
          </a>
        ),
      },
      { label: "Status", render: (row) => row.status || "Pending" },
    ]}
  />
);

export default JobInquiryManagement;
