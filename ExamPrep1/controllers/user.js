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
        login: (req, res, next) => {
            const { username, password } = req.body;

            models.User.findOne({ username }).then(user => {
                Promise.all([user, user.matchPassword(password)])
                    .then(([user, match]) => {
                        if (!match) {
                            console.log('Password is not valid');
                            return
                        }

                        const token = jwt.createToken({ id: user._id })

                        res
                            .cookie(config.development.cookie, token)
                            .redirect('/home');
                    })
            })
        },
        register: (req, res, next) => {
            const { username, password, repeatPassword } = req.body
            models.User.create({ username, password }).then((registeredUser) => {
                const token = jwt.createToken({ id: registeredUser._id })

                res
                    .cookie(config.development.cookie, token)
                    .redirect('/home');
            }).catch(err => {
                res.redirect('/user/register');
            })
        }
    }
}