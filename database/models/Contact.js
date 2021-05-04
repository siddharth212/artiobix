const mongoose = require('mongoose');
 
const ContactSchema = new mongoose.Schema({
    title: String,
    email: String,
    number: String,
    message: String
    
});
 
const Contact = mongoose.model('Contact', ContactSchema);
 
module.exports = Contact;