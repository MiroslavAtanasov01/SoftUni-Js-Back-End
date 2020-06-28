const mongoose = require('mongoose')
const { String, Number, Boolean, ObjectId } = mongoose.Schema.Types;

const playSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'You can not have empty fields'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'You can not have empty fields'],
        maxlength: [50, 'The Description should be max 50 character'],
    },
    imageUrl: {
        type: String,
        required: [true, 'You can not have empty fields'],
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: mongoose.SchemaTypes.Date,
        required: true,
    },
    usersLiked: [{
        type: ObjectId,
        ref: 'User'
    }],
    creatorId: {
        type: ObjectId,
        required: true
    },
})

// playSchema.path('imageUrl').validate(function (url) {
//     return url.startsWith('http://') || url.startsWith('https://')
// }, 'The imageUrl should be starts with http or https')


module.exports = mongoose.model('Play', playSchema)