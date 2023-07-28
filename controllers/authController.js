const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const crypto = require('crypto')
const User = require('./../models/userModel')
const AppError = require('../utils/appError')
const Email = require('./../utils/email');

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
        const url = `${req.protocol}://${req.get('host')}/me`;
        await new Email(newUser, url).sendWelcome()
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

exports.protect = async (req, res, next) => {
    try {
        // 1) getting token and check of it's there
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            res.status(401).json({
                status: 'fail',
                message: 'not logged in!',
            })
        }
        // 2) varification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

        // 3) check if user still exists
        const frestUser = await User.findById(decoded.id)
        if (!frestUser) {
            res.status(400).json({
                status: 'fail',
                message: 'invalid data sent!',
                error: err
            })
        }
        // 4) check if user changed password after the token was issued
        if (frestUser.changedPasswordAfter(decoded.iat)) {
            res.status(401).json({
                status: 'fail',
                message: 'user recently changed password! please log in again',
                error: err
            })
        }
        // grant access to protected routes
        req.user = frestUser
        next()
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'invalid data sent!',
            error: err
        })
    }
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user'
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }
        next();
    };
}

exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            res.status(401).json({
                status: 'fail',
                message: 'there is no user with this email address',
            })
        }
        // 2) Generate the random reset token
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });
        // 3) Send it to user's email

        // console.log('reset url', resetURL)
        // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
        try {
            const resetURL = `${req.protocol}://${req.get(
                'host'
            )}/api/v1/users/resetPassword/${resetToken}`;
            console.log('first')
            await new Email(user, resetURL).sendPasswordReset();
            res.status(200).json({
                status: 'success',
                message: 'Token sent to email!'
            });
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });

            return next(
                new AppError('There was an error sending the email. Try again later!'),
                500
            );
        }
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'invalid data sent!',
            error: err
        })
    }
}
exports.resetPassword = async (req, res, next) => {
    try {

        // 1) Get user based on the token
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        // 2) If token has not expired, and there is user, set the new password
        if (!user) {
            return next(new AppError('Token is invalid or has expired', 400));
        }
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // 3) Update changedPasswordAt property for the user
        // 4) Log the user in, send JWT
        const token = signToken(user._id)
        res.status(200).json({
            status: 'success',
            token
        })

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'invalid data sent!',
            error: err
        })
    }
}