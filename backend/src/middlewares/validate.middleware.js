import mongoose from "mongoose";

const isBlank = (value) =>
  value === undefined || value === null || String(value).trim() === "";

const validators = {
  optional: () => true,
  required: (value) => !isBlank(value),
  objectId: (value) => mongoose.Types.ObjectId.isValid(value),
  enum: (value, options) => options.includes(value),
  date: (value) => !Number.isNaN(new Date(value).getTime()),
  numberRange: (value, { min, max }) => {
    const number = Number(value);
    if (Number.isNaN(number)) return false;
    if (min !== undefined && number < min) return false;
    if (max !== undefined && number > max) return false;
    return true;
  },
};

const validateField = (value, rules) => {
  const isOptional = rules.some(
    (rule) => (typeof rule === "string" ? rule : rule.name) === "optional",
  );

  if (isOptional && isBlank(value)) return null;

  for (const rule of rules) {
    const name = typeof rule === "string" ? rule : rule.name;
    const options = typeof rule === "string" ? undefined : rule.options;
    const isValid = validators[name]?.(value, options);

    if (!isValid) {
      return typeof rule === "string" ? `Invalid ${name}` : rule.message;
    }
  }

  return null;
};

export const validate = (schema) => (req, res, next) => {
  const errors = {};

  for (const [source, fields] of Object.entries(schema)) {
    for (const [field, rules] of Object.entries(fields)) {
      const value = req[source]?.[field];
      const error = validateField(value, rules);

      if (error) {
        errors[field] = error;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    const error = new Error("Validation failed");
    error.statusCode = 400;
    error.errors = errors;
    return next(error);
  }

  return next();
};
