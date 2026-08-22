const courseStatus = ["Pending", "Approved", "Rejected", "Active", "Inactive"];
const skillLevels = ["Beginner", "Intermediate", "Advanced"];

export const createCourseValidation = {
  body: {
    title: [{ name: "required", message: "Course title is required" }],
    description: [
      { name: "required", message: "Course description is required" },
    ],
    category: [{ name: "required", message: "Course category is required" }],
    skillLevel: [
      { name: "required", message: "Skill level is required" },
      {
        name: "enum",
        options: skillLevels,
        message: "Skill level must be Beginner, Intermediate, or Advanced",
      },
    ],
    syllabus: [{ name: "required", message: "Syllabus is required" }],
    duration: [{ name: "required", message: "Course duration is required" }],
    fee: [
      { name: "required", message: "Course fee is required" },
      {
        name: "numberRange",
        options: { min: 0 },
        message: "Course fee must be a valid non-negative number",
      },
    ],
  },
};

export const updateCourseValidation = {
  body: {
    title: [{ name: "optional" }],
    description: [{ name: "optional" }],
    category: [{ name: "optional" }],
    skillLevel: [
      { name: "optional" },
      {
        name: "enum",
        options: skillLevels,
        message: "Skill level must be Beginner, Intermediate, or Advanced",
      },
    ],
    syllabus: [{ name: "optional" }],
    duration: [{ name: "optional" }],
    fee: [
      { name: "optional" },
      {
        name: "numberRange",
        options: { min: 0 },
        message: "Course fee must be a valid non-negative number",
      },
    ],
  },
};

export const updateCourseStatusValidation = {
  body: {
    status: [
      { name: "required", message: "Status is required" },
      { name: "enum", options: courseStatus, message: "Status is invalid" },
    ],
  },
};
