const express = require('express')
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser')
const config = require('./config')

module.exports = (app) => {
    app.use(cookieParser())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.engine('.hbs', handlebars({
        extname: '.hbs',
    }))

    app.use((req, res, next) => {
        res.locals.isLoggedIn = req.cookies[config.development.cookie] !== undefined;
        res.locals.username = req.cookies['username'] // TODO username or email

        next();
    })

    app.set('view engine', '.hbs')
    app.use(express.static('static'))
}