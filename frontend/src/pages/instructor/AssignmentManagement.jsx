import { Link } from "react-router-dom";

import InstructorModulePage from "./InstructorModulePage";
import { createAssignment, deleteAssignment, getMyAssignments, updateAssignment } from "../../api/assignment.services";

const AssignmentManagement = () => (
    <InstructorModulePage
        title="Assignments"
        description="Create and manage assignments for your own courses."
        queryKey="instructor-assignments"
        listFn={getMyAssignments}
        listKeys={["assignments"]}
        createFn={createAssignment}
        updateFn={updateAssignment}
        deleteFn={deleteAssignment}
        createLabel="Create Assignment"
        fields={[
            { name: "course", label: "Select course", type: "select", optionsKey: "courses", required: true, omitOnEdit: true, read: (row) => row.course?._id || row.course },
            { name: "title", label: "Assignment title", required: true },
            { name: "dueDate", label: "Due date", type: "date", required: true },
            { name: "status", label: "Status", type: "select", options: [{ value: "Active", label: "Active" }, { value: "Closed", label: "Closed" }], defaultValue: "Active" },
            { name: "attachment", label: "Attachment URL" },
            { name: "description", label: "Description", type: "textarea", required: true },
        ]}
        columns={[
            { label: "Title", render: (row) => row.title || "-" },
            { label: "Course", render: (row) => row.course?.title || "-" },
            { label: "Due Date", render: (row, formatDate) => formatDate(row.dueDate) },
            { label: "Status", render: (row) => row.status || "-" },
            { label: "Submissions", render: (row) => (
                <Link to={`/instructor/assignments/${row._id}/submissions`} className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    View Submissions
                </Link>
            ) },
        ]}
    />
);

export default AssignmentManagement;

