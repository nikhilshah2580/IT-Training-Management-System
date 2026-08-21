export const createUserValidation = {
  body: {
    fullName: [{ name: "required", message: "Full name is required" }],
    email: [{ name: "required", message: "Email is required" }],
    password: [{ name: "required", message: "Password is required" }],
    role: [
      { name: "optional" },
      {
        name: "enum",
        options: ["admin", "instructor", "student"],
        message: "Role is invalid",
      },
    ],
  },
};

export const updateUserValidation = {
  body: {
    role: [
      { name: "optional" },
      {
        name: "enum",
        options: ["admin", "instructor", "student"],
        message: "Role is invalid",
      },
    ],
    status: [
      { name: "optional" },
      {
        name: "enum",
        options: ["active", "inactive", "blocked"],
        message: "Status is invalid",
      },
    ],
  },
};
