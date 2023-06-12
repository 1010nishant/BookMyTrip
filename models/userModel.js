const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

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
        minlength: 6,
        select: false
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

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12)
    // delete passwordConfirm field
    this.passwordConfirm = undefined;
    next()
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}
const User = mongoose.model('User', userSchema)

module.exports = User;
