const mongoose = require('mongoose')
const { String, Number, Boolean, ObjectId, } = mongoose.Schema.Types;


const expenseSchema = new mongoose.Schema({
    merchant: {
        type: String,
        required: true,
        minlength: [4, 'Merchant is not valid'],
    },
    date: {
        type: mongoose.SchemaTypes.Date,
        required: true,
    },
    total: {
        type: Number,
        required: true,
        integer: true,
        // validate: {
        //     validator: Number.isInteger(),
        //     message: 'Total is not an integer value'
        // }
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        minlength: [10, 'The Description should be at least 20 characters'],
        maxlength: [50, 'The Description should be at least 20 characters'],
    },
    report: {
        type: Boolean,
        required: true,
        default: false
    },
    user: {
        type: ObjectId,
        ref: 'User'
    },
    creatorId: {
        type: ObjectId,
        required: true
    },
})

module.exports = mongoose.model('Expense', expenseSchema) 