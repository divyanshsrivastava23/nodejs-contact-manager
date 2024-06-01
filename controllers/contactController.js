const expressAsyncHandler = require("express-async-handler");
const Contact = require("../modals/contactModal")


//@desc Get all contacts
//@route POST /api/contacts
//@access private
const getContacts = expressAsyncHandler(async (req,res) => {
    const contacts = await Contact.find({user_id: req.user.id})
    res.status(200).json(contacts)
})

//@desc Create contact
//@route POST /api/contacts
//@access private
const createContact = expressAsyncHandler(async(req,res) => {
    const {name, email, phone} = req.body;
    if(!name || !email || !phone) {
        res.status(400)
        throw new Error("All fields are mandatory")
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    })
    res.status(201).json(contact)
})

//@desc Get contact
//@route GET /api/contacts
//@access private
const getContact = expressAsyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    res.status(200).json(contact);
});


//@desc Update contact
//@route PUT /api/contacts
//@access private
const updateContact = expressAsyncHandler(async(req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact Not Found")
    }

    if(contact.user_id.toString() !== req.user.id) {
        res.status(402);
        throw new Error("User don't have permission to update other user's contacts.")
    }

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
    res.status(200).json(updatedContact)
})


//@desc Delete contact
//@route DELETE /api/contacts
//@access private
const deleteContact = expressAsyncHandler(async(req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact Not Found")
    }
    if(contact.user_id.toString() !== req.user.id) {
        res.status(402);
        throw new Error("User don't have permission to update other user's contacts.")
    }

    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedContact)
})

module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact
}