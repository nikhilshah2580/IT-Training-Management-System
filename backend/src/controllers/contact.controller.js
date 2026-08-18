import {
    createContactService,
    getContactsService,
    getContactService,
    getMyContactsService,
    updateContactService,
    deleteContactService,
} from "../services/contact.service.js";

import { getIO } from "../socket/socket.js";

// CREATE CONTACT
export const createContact = async (req, res) => {
    const userId = req.user?._id || null;

    const contact = await createContactService({
        user: userId,
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
    });

    // Notify all connected admins
    try {
        const io = getIO();

        io.to("admins").emit("newContact", {
            message: "New contact inquiry received",
            contactId: contact._id,
            subject: contact.subject,
            name: contact.name,
        });
    } catch (error) {
        console.error("Socket notification error:", error.message);
    }

    return res.status(201).json({
        success: true,
        message: "Contact inquiry submitted successfully",
        contact,
    });
};

// GET ALL CONTACTS - ADMIN
export const getContacts = async (req, res) => {
    const result = await getContactsService({
        status: req.query.status,
        search: req.query.search,
        page: req.query.page,
        limit: req.query.limit,
    });

    return res.status(200).json({
        success: true,
        ...result,
    });
};

// GET SINGLE CONTACT - ADMIN
export const getContact = async (req, res) => {
    const contact = await getContactService(req.params.id);

    return res.status(200).json({
        success: true,
        contact,
    });
};

// GET MY CONTACTS
export const getMyContacts = async (req, res) => {
    const contacts = await getMyContactsService(req.user._id);

    return res.status(200).json({
        success: true,
        contacts,
    });
};

// UPDATE CONTACT - ADMIN
export const updateContact = async (req, res) => {
    const contact = await updateContactService(
        req.params.id,
        req.body,
        req.user._id,
    );

    // Notify the user
    try {
        if (contact.user?._id) {
            const io = getIO();

            io.to(`user:${contact.user._id}`).emit("contactUpdated", {
                message: "Your contact inquiry has been updated",
                contact,
            });
        }
    } catch (error) {
        console.error("Socket notification error:", error.message);
    }

    return res.status(200).json({
        success: true,
        message: "Contact inquiry updated successfully",
        contact,
    });
};

// DELETE CONTACT - ADMIN
export const deleteContact = async (req, res) => {
    await deleteContactService(req.params.id);

    return res.status(200).json({
        success: true,
        message: "Contact inquiry deleted successfully",
    });
};
