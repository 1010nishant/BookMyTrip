
const Tour = require('./../models/tourModel')

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// )

// exports.checkID = (req, res, next, val) => {
//     console.log(`id for tour is ${val}`)
//     // first solution for validation 
//     if (req.params.id * 1 > tours.length) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'invalid ID'
//         })
//     }
//     next();
// }

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'name of price is not provided'
        })
    }
    next()
}

exports.getAllTours = (req, res) => {
    console.log(req.requestTime)
    res.status(200).json({
        status: 'success',
        requestAt: req.requestTime,
        // results: tours.length,
        // data: {
        //     tours
        // }

    })
}

exports.getTour = (req, res) => {
    console.log(req.params)
    const id = req.params.id * 1;

    // const tour = tours.find(el => el.id === id)// if id > el.id then tour will be undifined(falsy value)
    // second solution for validation 
    // if (!tours) {
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'invalid ID'
    //     })
    // }
    res.status(200).json({
        status: 'success',
        // data: {
        //     tour
        // }
    })
}

exports.createTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    });
}

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    });
}

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    });
}