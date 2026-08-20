import InstructorModulePage from "./InstructorModulePage";
import { createCertificate, getCertificates, updateCertificate } from "../../api/certificate.services";

const CertificateManagement = () => (
    <InstructorModulePage
        title="Certificates"
        description="Issue and update certificates for students who completed your courses."
        queryKey="instructor-certificates"
        listFn={() => getCertificates({ limit: 100 })}
        listKeys={["certificates"]}
        createFn={createCertificate}
        updateFn={updateCertificate}
        deleteFn={null}
        allowDelete={false}
        createLabel="Issue Certificate"
        fields={[
            { name: "course", label: "Select course", type: "select", optionsKey: "courses", required: true, omitOnEdit: true, read: (row) => row.course?._id || row.course },
            { name: "student", label: "Select student", type: "select", optionsKey: "students", required: true, omitOnEdit: true, read: (row) => row.student?._id || row.student },
            { name: "completionDate", label: "Completion date", type: "date" },
            { name: "grade", label: "Grade 0-100", type: "number" },
            { name: "certificateUrl", label: "Certificate URL" },
            { name: "status", label: "Status", type: "select", options: [{ value: "Issued", label: "Issued" }, { value: "Revoked", label: "Revoked" }], defaultValue: "Issued" },
        ]}
        columns={[
            { label: "Certificate", render: (row) => row.certificateNumber || "-" },
            { label: "Student", render: (row) => row.student?.fullName || "-" },
            { label: "Course", render: (row) => row.course?.title || "-" },
            { label: "Status", render: (row) => row.status || "-" },
            { label: "Issued", render: (row, formatDate) => formatDate(row.issueDate || row.createdAt) },
        ]}
    />
);

export default CertificateManagement;
