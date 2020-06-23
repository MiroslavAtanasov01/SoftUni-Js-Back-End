const mongoose = require('mongoose')
const { String, Number, Boolean, ObjectId, Date } = mongoose.Schema.Types;

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    users: [{
        type: ObjectId,
        ref: 'User'
    }],
    creatorId: {
        type: ObjectId,
        required: true
    },
})

courseSchema.path('imageUrl').validate(function (url) {
    return url.startsWith('http://') || url.startsWith('https://')
}, 'Image url is not valid')


module.exports = mongoose.model('Course', courseSchema)