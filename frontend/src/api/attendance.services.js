import api from "./apiClient";

// ======================================================
// MARK ATTENDANCE (Instructor/Admin)
// ======================================================
export const markAttendance = async (data) => {
    const response = await api.post("/attendance", data);
    return response.data;
};

// ======================================================
// GET ALL ATTENDANCE (Instructor/Admin)
// ======================================================
export const getAttendance = async (params = {}) => {
    const response = await api.get("/attendance", {
        params,
    });
    return response.data;
};

// ======================================================
// GET SINGLE ATTENDANCE
// ======================================================
export const getAttendanceById = async (id) => {
    const response = await api.get(`/attendance/${id}`);
    return response.data;
};

// ======================================================
// UPDATE ATTENDANCE
// ======================================================
export const updateAttendance = async (id, data) => {
    const response = await api.put(`/attendance/${id}`, data);
    return response.data;
};

// ======================================================
// DELETE ATTENDANCE
// ======================================================
export const deleteAttendance = async (id) => {
    const response = await api.delete(`/attendance/${id}`);
    return response.data;
};

// ======================================================
// STUDENT MY ATTENDANCE
// ======================================================
export const getMyAttendance = async () => {
    const response = await api.get("/attendance/my");
    return response.data;
};

// ======================================================
// STUDENT ATTENDANCE PERCENTAGE
// ======================================================
export const getAttendancePercentage = async () => {
    const response = await api.get("/attendance/my/percentage");
    return response.data;
};
