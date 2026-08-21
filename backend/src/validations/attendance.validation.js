export const createAttendanceValidation = {
  body: {
    course: [
      { name: "required", message: "Course is required" },
      { name: "objectId", message: "Course must be a valid ID" },
    ],
    student: [
      { name: "required", message: "Student is required" },
      { name: "objectId", message: "Student must be a valid ID" },
    ],
    date: [
      { name: "required", message: "Date is required" },
      { name: "date", message: "Date must be valid" },
    ],
    status: [
      { name: "required", message: "Status is required" },
      {
        name: "enum",
        options: ["Present", "Absent", "Late"],
        message: "Status must be Present, Absent, or Late",
      },
    ],
  },
};

export const updateAttendanceValidation = {
  body: {
    status: [
      { name: "required", message: "Status is required" },
      {
        name: "enum",
        options: ["Present", "Absent", "Late"],
        message: "Status must be Present, Absent, or Late",
      },
    ],
  },
};
