import { useQuery } from "@tanstack/react-query";

import AdminModulePage from "./AdminModulePage";
import { getAttendance, markAttendance, updateAttendance, deleteAttendance } from "../../api/attendance.services";
import { getAdminCourses } from "../../api/course.services";
import { getUsers } from "../../api/user.services";

const readArray = (data, keys) => {
    for (const key of keys) {
        if (Array.isArray(data?.[key])) return data[key];
        if (Array.isArray(data?.data?.[key])) return data.data[key];
    }

    return [];
};

const AttendanceManagement = () => {
    const studentsQuery = useQuery({
        queryKey: ["admin-attendance-students"],
        queryFn: getUsers,
    });

    const coursesQuery = useQuery({
        queryKey: ["admin-attendance-courses"],
        queryFn: () => getAdminCourses({ limit: 100 }),
    });

    const students = readArray(studentsQuery.data, ["users"]).filter((user) => user.role === "student");
    const courses = readArray(coursesQuery.data, ["courses"]);

    return (
        <AdminModulePage title="Attendance Management" description="Create, review, and update attendance records." queryKey="admin-attendance" listFn={() => getAttendance({ limit: 100 })} listKeys={["attendances", "attendance"]} createFn={markAttendance} updateFn={updateAttendance} deleteFn={deleteAttendance} createLabel="Mark Attendance"
            fields={[{ name: "student", label: studentsQuery.isLoading ? "Loading students..." : "Select student", type: "select", required: true, options: students.map((student) => ({ value: student._id, label: `${student.fullName || "Unnamed student"}${student.email ? ` (${student.email})` : ""}` })), read: (row) => row.student?._id || row.student }, { name: "course", label: coursesQuery.isLoading ? "Loading courses..." : "Select course", type: "select", required: true, options: courses.map((course) => ({ value: course._id, label: course.title || "Untitled course" })), read: (row) => row.course?._id || row.course }, { name: "date", label: "Date", type: "date", required: true }, { name: "status", label: "Status", type: "select", defaultValue: "Present", options: ["Present", "Absent", "Late"].map((value) => ({ value, label: value })) }, { name: "remarks", label: "Remarks" }]}
            columns={[{ label: "Student", render: (row) => row.student?.fullName || "-" }, { label: "Course", render: (row) => row.course?.title || "-" }, { label: "Date", render: (row, formatDate) => formatDate(row.date) }, { label: "Status", render: (row) => row.status || "-" }]}
        />
    );
};

export default AttendanceManagement;
