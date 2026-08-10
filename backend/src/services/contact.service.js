import Contact from "../models/contact.model.js";

export const createContactService = async (data) => {
  return await Contact.create(data);
};

export const getContactsService = async () => {
  return await Contact.find().sort({
    createdAt: -1,
  });
};

export const getContactService = async (id) => {
  return await Contact.findById(id);
};

export const updateContactStatusService = async (id, status) => {
  return await Contact.findByIdAndUpdate(id, { status }, { new: true });
};

export const deleteContactService = async (id) => {
  return await Contact.findByIdAndDelete(id);
};


export const replyContactService = async (id, reply) => {
  return await Contact.findByIdAndUpdate(
    id,
    {
      reply,
      status: "Replied",
    },
    {
      new: true,
    },
  );
};
