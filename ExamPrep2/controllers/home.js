const models = require('../models')

module.exports = {
    get: {
        home: async (req, res, next) => {
            res.render('homePage', {
                title: 'Home Page',
            })
        },
        shared: async (req, res, next) => {
            const trips = await models.Trip.find().lean()
            res.render('sharedTrips', {
                title: 'Shared trips', trips
            })
        }
    }
}