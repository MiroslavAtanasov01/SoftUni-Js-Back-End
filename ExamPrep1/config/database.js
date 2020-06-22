const mongoose = require('mongoose')
const config = require('./config')
const dbName = 'exam-prep-tutorial'

module.exports = () => {
    return mongoose.connect(config.development.dbURL + dbName,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        },
        console.log('Database is setup and ready')
    )
}