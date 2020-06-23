const models = require('../models');
const jwt = require('../utils/jwt')
const config = require('../config/config')

module.exports = {
    get: {
        login: (req, res, next) => {
            res.render('loginPage', {
                title: 'Login Page',
                username: req.user
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
                    error: 'Username or password is not correct'
                })
            }

            const match = await user.matchPassword(password)
            if (!match) {
                return res.render('loginPage', {
                    error: 'Username or password is not correct'
                })
            }

            const token = jwt.createToken({ id: user._id })
            res.cookie(config.development.cookie, token).redirect('/home');
        },
        register: async (req, res, next) => {
            const { username, password, repeatPassword } = req.body

            if (!password || password.length < 5 || password.match(/^[A-Za-z0-9]+$/g) || password !== repeatPassword) {
                return res.render('registerPage', {
                    error: 'Username or password is not valid'
                })
            }

            const registeredUser = await models.User.create({ username, password })
            const token = jwt.createToken({ id: registeredUser._id })

            res.cookie(config.development.cookie, token).redirect('/home');
        }
    }
}