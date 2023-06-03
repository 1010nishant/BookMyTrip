
const Tour = require('./../models/tourModel')

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next()

}

exports.getAllTours = async (req, res) => {
    try {
        // 1) filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])


        // 2) advanced filtering
        let queryStr = JSON.stringify(queryObj);
        console.log(queryStr)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        let query = Tour.find(JSON.parse(queryStr))

        // 3) sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            console.log(sortBy)
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createAt')

        }
        // 4) field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ')
            console.log(fields)
            query = query.select(fields)
        } else {
            query = query.select('-__v')

        }

        // 5) pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit

        // page=3&limit=10, 1-10 -> page=1, 11-20 -> page=2, 21-30 -> page=3
        query = query.skip(skip).limit(limit) // --> page=3

        if (req.query.page) {
            const numTours = await Tour.countDocuments()
            if (skip >= numTours) throw new Error('this page does not exist')
        }
        const tours = await query
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }

        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getTour = async (req, res) => {

    try {
        // below code is just like const tour = await Tour.findOne({_id: req.params.id})
        const tour = await Tour.findById(req.params.id)

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
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

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'invalid data sent!',
            error: err
        })
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'invalid data sent!',
            error: err
        })
    }
}