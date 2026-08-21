import AdminModulePage from "./AdminModulePage";
import {
  getContacts,
  updateContactStatus,
  deleteContact,
} from "../../api/contact.services";

const ContactManagement = () => (
  <AdminModulePage
    title="Contact Management"
    description="Review contact messages and mark their progress."
    queryKey="admin-contacts"
    listFn={() => getContacts({ limit: 100 })}
    listKeys={["contacts"]}
    showForm={false}
    allowEdit={false}
    deleteFn={deleteContact}
    statusFn={updateContactStatus}
    statusOptions={[
      { value: "Pending", label: "Pending" },
      { value: "In Progress", label: "In Progress" },
      {
        value: "Resolved",
        label: "Resolved",
        className: "bg-green-100 text-green-700 hover:bg-green-200",
      },
      {
        value: "Rejected",
        label: "Reject",
        className: "bg-red-100 text-red-700 hover:bg-red-200",
      },
    ]}
    columns={[
      { label: "Name", render: (row) => row.name || row.fullName || "-" },
      { label: "Email", render: (row) => row.email || "-" },
      { label: "Subject", render: (row) => row.subject || "-" },
      { label: "Message", render: (row) => row.message || "-" },
      { label: "Status", render: (row) => row.status || "-" },
    ]}
  />
);
export default ContactManagement;
