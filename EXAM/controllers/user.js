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
            res.cookie(config.development.cookie, token).cookie('username', username).redirect('/home');
        },
        register: async (req, res, next) => {
            const { username, password, repeatPassword } = req.body

            try {
                if (password !== repeatPassword) {
                    return res.render('registerPage', {
                        error: 'The repeat password should be equal to the password'
                    })
                }

                const registeredUser = await models.User.create({ username, password })
                const token = jwt.createToken({ id: registeredUser._id })

                res.cookie(config.development.cookie, token).cookie('username', username).redirect('/home');
            } catch (err) {
                if (err.name === 'MongoError') {
                    return res.render('registerPage', {
                        error: 'Username is already taken!'
                    })
                } else
                    if (err.name === 'ValidationError' || err.name === 'MongooseError') {
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