const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { String, Number, Boolean, ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
        match: [/\w+@\w+.[A-Za-z]+/g, 'Email is not valid'],
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minlength: [6, 'Password is not valid'],
    },
    trips: [{
        type: ObjectId,
        ref: 'Trip'
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