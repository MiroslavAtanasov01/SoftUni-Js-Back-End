const mongoose = require('mongoose')
const config = require('./config')
const dbName = 'exam'

module.exports = () => {
    return mongoose.connect(config.development.dbURL + dbName,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: false,
        },
        console.log('Database is setup and ready')
    )
}