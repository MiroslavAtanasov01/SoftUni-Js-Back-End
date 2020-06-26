const config = require('../config/config')
const models = require('../models')

module.exports = {
    get: {
        create: (req, res, next) => {
            res.render('offerTrip', {
                title: 'Offer trip!',
            })
        },
        details: async (req, res, next) => {
            const trip = await models.Trip.findById(req.params.id).populate('buddies').lean()
            const creator = await models.User.findById(trip.creatorId).lean()

            res.render('tripDetails', {
                title: 'Trip details',
                isCreator: req.user.id.toString() === trip.creatorId.toString(),
                isAlreadyJoined: JSON.stringify(trip.buddies).includes(JSON.stringify(req.user.id)),
                isAvailableSeats: trip.seats.toString() > 0,
                ...trip,
                creator
            })
        },
        delete: async (req, res, next) => {
            await models.Trip.findByIdAndRemove(req.params.id).lean()
            // await models.User.findByIdAndRemove(req.params.id).lean() 
            res.redirect('/home')
        },
        join: async (req, res, next) => {
            await models.Trip.findByIdAndUpdate(req.params.id, {
                $inc: { 'seats': -1 },
                $addToSet: {
                    buddies: [req.user.id],
                },
            });

            res.redirect(`/trip/details/${req.params.id}`)
        }
    },
    post: {
        create: async (req, res, next) => {
            const { startAndEndPoint, dateTime, carImage, seats, description } = req.body
            const [startPoint, endPoint] = startAndEndPoint.split(' - ')
            const [date, time] = dateTime.split(' - ')

            if (!startAndEndPoint.match(/[A-Za-z]{4,} - [A-Za-z]{4,}/g)) {
                return res.render('offerTrip', {
                    error: 'Start and End is not valid'
                })
            }

            if (!dateTime.match(/[A-Za-z1-9 ]{6,} - [A-Za-z1-9 ]{6,}/g)) {
                return res.render('offerTrip', {
                    error: 'Date and Time is not valid'
                })
            }

            try {
                const data = await models.Trip.create({
                    startPoint, endPoint, date, time, seats, carImage, description, creatorId: req.user.id
                })

                await models.User.findByIdAndUpdate(req.user._id, { $addToSet: { trips: [data.id], }, });

                res.redirect('/home');
            } catch (err) {
                // if (err.name = 'MongoError') {
                //     return res.render('offerTrip', {
                //         error: 'Title is already taken!'
                //     })
                // } else
                if (err.name === 'ValidationError' || err.name === 'MongooseError') {
                    const errorMessages = Object.entries(err.errors).map(e => {
                        return e[1].message
                    })
                    return res.render('offerTrip', {
                        error: errorMessages
                    })
                }
            }

        },
    }
}