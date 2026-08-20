import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Loader2, RefreshCw, Save } from "lucide-react";
import { toast } from "react-toastify";

import { getAttendance, markAttendance, updateAttendance } from "../../api/attendance.services";
import { getInstructorEnrollments } from "../../api/enrollment.services";
import { getMyCourses } from "../../api/course.services";

const statusOptions = ["Present", "Absent", "Late"];
const today = new Date().toISOString().slice(0, 10);

const readList = (data, keys) => {
    for (const key of keys) {
        if (Array.isArray(data?.[key])) return data[key];
        if (Array.isArray(data?.data?.[key])) return data.data[key];
    }

    return [];
};

const AttendanceManagement = () => {
    const queryClient = useQueryClient();
    const [courseId, setCourseId] = useState("");
    const [studentId, setStudentId] = useState("");
    const [date, setDate] = useState(today);
    const [status, setStatus] = useState("Present");
    const [remarks, setRemarks] = useState("");

    const coursesQuery = useQuery({
        queryKey: ["instructor-attendance-courses"],
        queryFn: () => getMyCourses({ limit: 100 }),
    });

    const enrollmentsQuery = useQuery({
        queryKey: ["instructor-attendance-enrollments", courseId],
        queryFn: () => getInstructorEnrollments({ courseId: courseId || undefined, status: "Active", limit: 100 }),
    });

    const attendanceQuery = useQuery({
        queryKey: ["instructor-attendance", { courseId, date }],
        queryFn: () => getAttendance({ course: courseId || undefined, date: date || undefined, limit: 100 }),
    });

    const courses = readList(coursesQuery.data, ["courses"]);
    const enrollments = readList(enrollmentsQuery.data, ["enrollments"]);
    const attendanceRecords = readList(attendanceQuery.data, ["attendances", "attendance"]);

    const students = useMemo(() => {
        const uniqueStudents = new Map();

        enrollments.forEach((enrollment) => {
            if (enrollment.student?._id) {
                uniqueStudents.set(enrollment.student._id, enrollment.student);
            }
        });

        return Array.from(uniqueStudents.values());
    }, [enrollments]);

    const markMutation = useMutation({
        mutationFn: markAttendance,
        onSuccess: (response) => {
            toast.success(response?.message || "Attendance marked");
            setStudentId("");
            setRemarks("");
            queryClient.invalidateQueries({ queryKey: ["instructor-attendance"] });
        },
        onError: (error) => toast.error(error?.response?.data?.message || "Failed to mark attendance"),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }) => updateAttendance(id, payload),
        onSuccess: (response) => {
            toast.success(response?.message || "Attendance updated");
            queryClient.invalidateQueries({ queryKey: ["instructor-attendance"] });
        },
        onError: (error) => toast.error(error?.response?.data?.message || "Failed to update attendance"),
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        markMutation.mutate({
            course: courseId,
            student: studentId,
            date,
            status,
            remarks,
        });
    };

    const isLoading = coursesQuery.isLoading || enrollmentsQuery.isLoading || attendanceQuery.isLoading;

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Mark and update attendance for students in your courses.</p>
                </div>
                <button type="button" onClick={() => attendanceQuery.refetch()} disabled={attendanceQuery.isFetching} className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2.5 font-medium hover:bg-gray-50 disabled:opacity-50">
                    <RefreshCw size={17} className={attendanceQuery.isFetching ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                    <CalendarDays size={18} />
                    Mark Attendance
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <select required value={courseId} onChange={(event) => { setCourseId(event.target.value); setStudentId(""); }} className="rounded-lg border px-3 py-2.5">
                        <option value="">Select course</option>
                        {courses.map((course) => <option key={course._id} value={course._id}>{course.title}</option>)}
                    </select>
                    <select required value={studentId} onChange={(event) => setStudentId(event.target.value)} disabled={!courseId || enrollmentsQuery.isLoading} className="rounded-lg border px-3 py-2.5 disabled:bg-gray-50">
                        <option value="">{courseId ? "Select student" : "Select course first"}</option>
                        {students.map((student) => <option key={student._id} value={student._id}>{student.fullName} {student.email ? `(${student.email})` : ""}</option>)}
                    </select>
                    <input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="rounded-lg border px-3 py-2.5" />
                    <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border px-3 py-2.5">
                        {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                    <input type="text" value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Remarks" className="rounded-lg border px-3 py-2.5" />
                </div>
                <button type="submit" disabled={markMutation.isPending} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                    <Save size={17} />
                    Mark Attendance
                </button>
            </form>

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[56rem]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Course</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {isLoading ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500"><Loader2 className="mx-auto animate-spin text-blue-600" /></td></tr>
                            ) : attendanceRecords.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No attendance records found.</td></tr>
                            ) : attendanceRecords.map((record) => (
                                <tr key={record._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-700">{record.student?.fullName || "-"}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{record.course?.title || "-"}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{record.date ? new Date(record.date).toLocaleDateString() : "-"}</td>
                                    <td className="px-6 py-4">
                                        <select value={record.status} disabled={updateMutation.isPending} onChange={(event) => updateMutation.mutate({ id: record._id, payload: { status: event.target.value, remarks: record.remarks || "" } })} className="rounded-lg border px-3 py-2 text-sm">
                                            {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{record.remarks || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceManagement;

