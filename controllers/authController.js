const jwt = require('jsonwebtoken')
const User = require('./../models/userModel')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        })
        const token = signToken(newUser._id)
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'invalid data sent!',
            error: err
        })
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // 1) check if email, password exists
        if (!email || !password) {
            // apply error handling
            res.status(400).json({
                status: 'fail',
                message: 'provide email or password!',
                error: err
            })
        }
        //2) check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password')

        if (!user || !(await user.correctPassword(password, user.password))) {
            res.status(400).json({
                status: 'fail',
                message: 'incorrect email or password',
                error: err
            })
        }
        //3) if everything ok send token to client
        const token = signToken(user._id)
        res.status(201).json({
            status: 'success',
            data: {
                token
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'invalid data sent!',
            error: err
        })
    }

}