const models = require('../models')

module.exports = {
    get: {
        home: async (req, res, next) => {

            const plays = await models.Play.find({ isPublic: true }).lean().sort({ createdAt: -1 })
            const logoutPlays = await models.Play.find().lean().sort({ usersLiked: - 1 }).limit(3)

            res.render('homePage', {
                title: 'Home Page', plays, logoutPlays
            })
        },
        sortDate: async (req, res, next) => {
            const plays = await models.Play.find({ isPublic: true }).lean().sort({ createdAt: - 1 })

            res.render('homePage', {
                title: 'Home Page', plays
            })
        },
        sortLike: async (req, res, next) => {
            const plays = await models.Play.find({ isPublic: true }).lean().sort({ usersLiked: - 1 })

            res.render('homePage', {
                title: 'Home Page', plays
            })
        }
    }
}