import AdminModulePage from "./AdminModulePage";
import {
  getAllInstructorProfiles,
  approveInstructorProfile,
  rejectInstructorProfile,
  deleteInstructorProfile,
} from "../../api/instructorProfile.services";

const InstructorManagement = () => (
  <AdminModulePage
    title="Instructor Management"
    description="Review instructor profiles and approve or reject them."
    queryKey="admin-instructors"
    listFn={() => getAllInstructorProfiles({ limit: 100 })}
    listKeys={["profiles", "instructors", "instructorProfiles"]}
    showForm={false}
    allowEdit={false}
    deleteFn={deleteInstructorProfile}
    statusFn={(id, status) =>
      status === "Approved"
        ? approveInstructorProfile(id)
        : rejectInstructorProfile(id)
    }
    statusOptions={[
      {
        value: "Approved",
        label: "Approve",
        className: "bg-green-100 text-green-700 hover:bg-green-200",
      },
      {
        value: "Rejected",
        label: "Reject",
        className: "bg-red-100 text-red-700 hover:bg-red-200",
      },
    ]}
    columns={[
      {
        label: "Instructor",
        render: (row) =>
          row.user?.fullName || row.instructor?.fullName || row.fullName || "-",
      },
      {
        label: "Email",
        render: (row) =>
          row.user?.email || row.instructor?.email || row.email || "-",
      },
      {
        label: "Expertise",
        render: (row) =>
          Array.isArray(row.expertise)
            ? row.expertise.join(", ")
            : row.expertise || "-",
      },
      { label: "Status", render: (row) => row.status || "-" },
    ]}
  />
);
export default InstructorManagement;
