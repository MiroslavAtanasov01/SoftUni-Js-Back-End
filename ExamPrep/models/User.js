const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { String, Number, Boolean, ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        match: [/^[A-Za-z0-9]+$/g, 'Username is not valid'],
    },
    password: {
        type: String,
        required: true,
    },
    courses: [{
        type: ObjectId,
        ref: 'Course'
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
            if (err) { next(err); return; }
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) { next(err); return; }
                this.password = hash;
                next();
            });
        });
        return;
    }
    next();
});

module.exports = mongoose.model('User', userSchema)