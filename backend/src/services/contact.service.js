import Contact from "../models/contact.model.js";
import User from "../models/user.model.js";

// CREATE CONTACT
export const createContactService = async (data) => {
  const { user, name, email, phone, subject, message } = data;

  const contact = await Contact.create({
    user: user || null,
    name,
    email,
    phone,
    subject,
    message,
  });

  return contact;
};

// GET ALL CONTACTS - ADMIN
export const getContactsService = async ({
  status,
  search,
  page = 1,
  limit = 10,
}) => {
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
    ];
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.max(Number(limit) || 10, 1);

  const skip = (pageNumber - 1) * limitNumber;

  const [contacts, total] = await Promise.all([
    Contact.find(filter)
      .populate("user", "fullName email role")
      .populate("repliedBy", "fullName email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber),

    Contact.countDocuments(filter),
  ]);

  return {
    contacts,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

// GET SINGLE CONTACT
export const getContactService = async (id) => {
  const contact = await Contact.findById(id)
    .populate("user", "fullName email role")
    .populate("repliedBy", "fullName email role");

  if (!contact) {
    const error = new Error("Contact inquiry not found");
    error.statusCode = 404;
    throw error;
  }

  return contact;
};

// GET MY CONTACTS
export const getMyContactsService = async (userId) => {
  return await Contact.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("repliedBy", "fullName email");
};

// UPDATE CONTACT - ADMIN
export const updateContactService = async (id, data, adminId) => {
  const contact = await Contact.findById(id);

  if (!contact) {
    const error = new Error("Contact inquiry not found");
    error.statusCode = 404;
    throw error;
  }

  if (data.status !== undefined) {
    const allowedStatuses = ["Pending", "In Progress", "Resolved", "Rejected"];

    if (!allowedStatuses.includes(data.status)) {
      const error = new Error("Invalid contact status");
      error.statusCode = 400;
      throw error;
    }

    contact.status = data.status;
  }

  if (data.adminReply !== undefined) {
    contact.adminReply = data.adminReply;
    contact.repliedBy = adminId;
    contact.repliedAt = new Date();

    // Automatically move to resolved when admin replies
    if (!data.status) {
      contact.status = "Resolved";
    }
  }

  await contact.save();

  return await Contact.findById(contact._id)
    .populate("user", "fullName email role")
    .populate("repliedBy", "fullName email role");
};

// DELETE CONTACT
export const deleteContactService = async (id) => {
  const contact = await Contact.findByIdAndDelete(id);

  if (!contact) {
    const error = new Error("Contact inquiry not found");
    error.statusCode = 404;
    throw error;
  }

  return contact;
};
