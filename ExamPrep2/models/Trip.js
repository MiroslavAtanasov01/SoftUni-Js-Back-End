const mongoose = require('mongoose')
const { String, Number, Boolean, ObjectId } = mongoose.Schema.Types;

const tripSchema = new mongoose.Schema({
    startPoint: {
        type: String,
        required: true,
    },
    endPoint: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    seats: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        required: true,
        minlength: [10, 'The Description should be at least 20 characters'],
    },
    carImage: {
        type: String,
        required: true,
    },
    buddies: [{
        type: ObjectId,
        ref: 'User'
    }],
    creatorId: {
        type: ObjectId,
        required: true
    },
})

tripSchema.path('carImage').validate(function (url) {
    return url.startsWith('http://') || url.startsWith('https://')
}, 'The imageUrl should be starts with http or https')

module.exports = mongoose.model('Trip', tripSchema)