const mongoose = require('mongoose');
const validator = require('validator');

// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minlength: 6
    },
    passwordConfirm: {
        type: String,
        required: [true, 'please confirm your password'],
        validate: {
            // this will work on create() and save()
            validator: function (el) {
                return el === this.password
            }
        }
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User;
