const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { String, Number, Boolean, ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        unique: true,
        match: [/^[A-Za-z0-9]+$/g, 'Username is not valid'],
        minlength: [3, 'Username is not valid'],

    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        match: [/^[A-Za-z0-9]+$/g, 'Password is not valid'],
        minlength: [3, 'Password is not valid'],
    },
    likedPlays: [{
        type: ObjectId,
        ref: 'Play'
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