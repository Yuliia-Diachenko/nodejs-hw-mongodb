import { getAllContacts,
      getContactById,
      createContact,
      deleteContact,
      updateContact }
      from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { query } from 'express';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';


export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const contacts = await getAllContacts({page, perPage, sortBy, sortOrder, filter,});
  res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts,
      query
    });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  // Відповідь, якщо контакт не знайдено
  if (!contact) {
  throw createHttpError(404, 'Contact not found');
  };
  // Відповідь, якщо контакт знайдено
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
};

export const createContactsController = async (req, res) => {
  const contact = await createContact({
    "name": req.body.name,
    "email": req.body.email,
    "phoneNumber": req.body.phoneNumber,
    "isFavourite": req.body.isFavourite,
    "contactType": req.body.contactType,
    });

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const student = await deleteContact(contactId);

  if (!student) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
  };

export const upsertContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body, {
      upsert: true,
  });
  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data: result.contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};
