const config = require('../config/config')
const models = require('../models')

module.exports = {
    get: {
        home: async (req, res, next) => {
            const courses = await models.Course.find().lean()
            res.render('homePage', {
                title: 'Home Page',
                isLoggedIn: req.cookies[config.development.cookie] !== undefined,
                courses
            })
        }
    }
}