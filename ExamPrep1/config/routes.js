const routes = require('../routes')

module.exports = (app) => {
    app.use('/home', routes.home)
    app.use('/user', routes.user)
    app.use('/course', routes.course)

    app.use('*', (req, res, next) => {
        res.send('<h1>Page not found</h1>')
    })
};