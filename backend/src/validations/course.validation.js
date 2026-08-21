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
    price: [{ name: "required", message: "Course price is required" }],
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
