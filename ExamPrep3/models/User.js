const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { String, Number, Boolean, ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        unique: true,
        minlength: [4, 'Username is not valid'],
        match: [/^[A-Za-z0-9]+$/g, 'Username is not valid'],
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minlength: [8, 'Password is not valid'],
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
    },
    expenses: [{
        type: ObjectId,
        ref: 'Expense'
    }]
})


userSchema.methods = {
    matchPassword: function (password) {
        return bcrypt.compare(password, this.password);
    }
};

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err)
            }
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) {
                    return next(err)
                }
                this.password = hash;
                next();
            });
        });
        return;
    }
    next();
});

module.exports = mongoose.model('User', userSchema)