import {
  createContactService,
  getContactsService,
  getContactService,
  updateContactStatusService,
  replyContactService,
  deleteContactService,
} from "../services/contact.service.js";
import sendEmail from "../utils/sendEmail.js";
import { getIO } from "../socket/socket.js";

//user submit contact
export const createContact = async (req, res) => {
  const contact = await createContactService(req.body);

   // Save notification
  const notification = await Notification.create({
    title: "New Contact Inquiry",
    message: `${contact.fullName} sent a new inquiry.`,
    type: "contact",
    referenceId: contact._id,
  });

 try {
  getIO().emit("notification", notification);
} catch (err) {
  console.log("Socket not initialized");
}

  res.status(201).json({
    success: true,
    message: "Message sent successfully.",
    contact,
  });
};

//admin get all messages
export const getContacts = async (req, res) => {
  const contacts = await getContactsService();

  res.status(200).json({
    success: true,
    contacts,
  });
};

//admin get single message
export const getContact = async (req, res) => {
  const contact = await getContactService(req.params.id);

  if (!contact) {
    const err = new Error("Contact not found");
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({
    success: true,
    contact,
  });
};

//updated contact
export const updateContactStatus = async (req, res) => {
  const contact = await updateContactStatusService(
    req.params.id,
    req.body.status,
  );

  if (!contact) {
    const err = new Error("Contact not found");
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({
    success: true,
    message: "Status updated successfully.",
    contact,
  });
};

//delete contact
export const deleteContact = async (req, res) => {
  const contact = await deleteContactService(req.params.id);

  if (!contact) {
    const err = new Error("Contact not found");
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({
    success: true,
    message: "Message deleted successfully.",
  });
};

export const replyContact = async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply message cannot be empty",
      });
    }

    const contact = await getContactService(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // Send the email reply first
    await sendEmail(
      contact.email,
      "Reply from Momo Restaurant",
      `
      <h2>Momo Restaurant</h2>
      <p>Hello ${contact.fullName},</p>
      <p>${reply}</p>
      `,
    );

    // Update the contact status/reply in the database
    const updatedContact = await replyContactService(req.params.id, reply);

    return res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      contact: updatedContact,
    });
  } catch (error) {
    console.error("Error in replyContact controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while sending reply",
      error: error.message,
    });
  }
};






