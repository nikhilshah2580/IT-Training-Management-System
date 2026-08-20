import AdminModulePage from "./AdminModulePage";
import { getDemoClasses, updateDemoClassStatus, deleteDemoClass } from "../../api/demoClass.services";

const DemoClassManagement = () => (
    <AdminModulePage title="Demo Class Management" description="Review demo class requests and update their status." queryKey="admin-demo-classes" listFn={() => getDemoClasses({ limit: 100 })} listKeys={["demoClasses"]} showForm={false} allowEdit={false} deleteFn={deleteDemoClass} statusFn={updateDemoClassStatus} statusOptions={[{ value: "Scheduled", label: "Scheduled" }, { value: "Completed", label: "Completed", className: "bg-green-100 text-green-700 hover:bg-green-200" }, { value: "Cancelled", label: "Cancel", className: "bg-red-100 text-red-700 hover:bg-red-200" }]}
        columns={[{ label: "Student", render: (row) => row.student?.fullName || row.name || "-" }, { label: "Course", render: (row) => row.course?.title || "-" }, { label: "Schedule", render: (row, formatDate) => formatDate(row.scheduledAt || row.date) }, { label: "Mode", render: (row) => row.mode || "-" }, { label: "Status", render: (row) => row.status || "-" }]}
    />
);
export default DemoClassManagement;

