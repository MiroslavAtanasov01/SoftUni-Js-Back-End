const config = require('../config/config')
const models = require('../models')

module.exports = {
    get: {
        home: async (req, res, next) => {
            // const { search } = req.body;

            // let query = {};
            // if (search) {
            //     query = {
            //         ...query, name: { $regex: new RegExp("^" + search.toLowerCase(), "i") }
            //     }
            // }

            const courses = await models.Course.find().lean()
            const sortedCourses = courses
                .filter(e => e.isPublic === true)
                .sort((a, b) => { return b.createdAt - a.createdAt })
            const firstThree = courses
                .slice(0, 3)
                .sort((a, b) => { return b.users.length - a.users.length })

            res.render('homePage', {
                title: 'Home Page',
                isLoggedIn: req.cookies[config.development.cookie] !== undefined,
                courses,
                sortedCourses,
                firstThree,
                search,
                // username: req.user.username
            })
        }
    }
}