import AdminModulePage from "./AdminModulePage";
import {
  createCertificate,
  getCertificates,
  updateCertificate,
} from "../../api/certificate.services";

const CertificateManagement = () => (
  <AdminModulePage
    title="Certificate Management"
    description="Issue and update student certificates."
    queryKey="admin-certificates"
    listFn={() => getCertificates({ limit: 100 })}
    listKeys={["certificates"]}
    createFn={createCertificate}
    updateFn={updateCertificate}
    deleteFn={null}
    allowDelete={false}
    createLabel="Issue Certificate"
    fields={[
      { name: "student", label: "Student ID", required: true },
      { name: "course", label: "Course ID", required: true },
      { name: "completionDate", label: "Completion date", type: "date" },
      { name: "grade", label: "Grade 0-100", type: "number" },
      { name: "certificateUrl", label: "Certificate URL" },
      {
        name: "status",
        label: "Status",
        type: "select",
        defaultValue: "Issued",
        options: ["Issued", "Revoked"].map((value) => ({
          value,
          label: value,
        })),
      },
    ]}
    columns={[
      { label: "Certificate", render: (row) => row.certificateNumber || "-" },
      { label: "Student", render: (row) => row.student?.fullName || "-" },
      { label: "Course", render: (row) => row.course?.title || "-" },
      { label: "Status", render: (row) => row.status || "-" },
      {
        label: "Issued",
        render: (row, formatDate) => formatDate(row.issueDate || row.createdAt),
      },
    ]}
  />
);
export default CertificateManagement;
