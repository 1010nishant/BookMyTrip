const mongoose = require('mongoose')

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'a tour must have a name'],
        unique: true
    },
    duration: {
        type: Number,
        require: [true, 'a tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        require: [true, 'a tour must have a group size']
    },
    difficulty: {
        type: String,
        require: [true, 'a tour must have a difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        require: [true, `a tour must have a price`]
    },
    priceDiscount: {
        type: Number
    },
    summary: {
        type: String,
        trim: true,
        require: [true, `a tour must have a description`]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        require: [true, `a tour must have a cover image`]
    },
    images: [String],
    createAt: {
        type: Date,
        default: Date.now(),
        select: false

    },
    startDates: [Date]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour;