const routes = require('../routes')

module.exports = (app) => {
    app.use('/home', routes.home)
    app.use('/user', routes.user)
    app.use('/trip', routes.trip)

    app.use('*', (req, res, next) => {
        res.render('404')
    })
};