const models = require('../models');
const jwt = require('../utils/jwt')
const config = require('../config/config');

module.exports = {
    get: {
        login: (req, res, next) => {
            res.render('loginPage', {
                title: 'Login Page',
            })
        },
        register: (req, res, next) => {
            res.render('registerPage', {
                title: 'Register Page'
            })
        },
        logout: (req, res, next) => {
            res.clearCookie(config.development.cookie)
                .redirect('/home')
        },
        profile: async (req, res, next) => {
            const user = await models.User.findById(req.user.id).lean()

            const expenses = await models.User.findById(req.user.id).populate('expenses').lean()
            let totalAmount = 0;
            expenses.expenses.map(e => { totalAmount += e.total })

            res.render('profile', {
                title: 'Profile', ...user, totalAmount
            })
        }
    },

    post: {
        login: async (req, res, next) => {
            const { username, password } = req.body;

            const user = await models.User.findOne({ username })
            if (!user) {
                return res.render('loginPage', {
                    error: 'Username is not correct'
                })
            }

            const match = await user.matchPassword(password)
            if (!match) {
                return res.render('loginPage', {
                    error: 'Password is not correct'
                })
            }

            const token = jwt.createToken({ id: user._id })
            res.cookie(config.development.cookie, token).cookie('username', username).redirect('/home/expenses');
        },
        register: async (req, res, next) => {
            const { username, password, repeatPassword, amount } = req.body

            try {
                if (password !== repeatPassword) {
                    return res.render('registerPage', {
                        error: 'The repeat password should be equal to the password'
                    })
                }

                const registeredUser = await models.User.create({ username, password, amount })
                const token = jwt.createToken({ id: registeredUser._id })

                res.cookie(config.development.cookie, token).cookie('username', username).redirect('/home/expenses');
            } catch (err) {
                if (err.name === 'MongoError') {
                    return res.render('registerPage', {
                        error: 'Username is already taken!'
                    })
                } else if (err.name === 'ValidationError' || err.name === 'MongooseError') {
                    const errorMessages = Object.entries(err.errors).map(e => {
                        return e[1].message
                    })
                    return res.render('registerPage', {
                        error: errorMessages
                    })
                }

            }
        }
    }
}