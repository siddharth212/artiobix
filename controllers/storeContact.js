
const Contact = require('../database/models/Contact')
 
module.exports = (req, res) => {
    Contact.create(req.body, (error, user) => {
        if (error) {
            return res.redirect('/contact')
        }
        res.redirect('/')
    })
}