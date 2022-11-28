const express = require('express')

const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const { Booking, Spot, Review, SpotImage, User, ReviewImage } = require('../../db/models')

const router = express.Router();

//      GET
router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id
    let final = []

    const bookings = await Booking.findAll({
        where: {
            userId
        },
        include: [
            {
                model: Spot,
                include: {
                    model: SpotImage
                }
            }
        ]
    })
    if (bookings) {

        bookings.forEach(booking => {
            let spotDataValues = booking.Spot.dataValues

            if (spotDataValues.SpotImages.length) {
                spotDataValues.SpotImages.forEach(spotImage => {
                    if (spotImage.preview) {
                        spotDataValues.previewImage = spotImage.url
                    }
                })

            }
            if (!spotDataValues.previewImage) {
                spotDataValues.previewImage = 'No Preview Image Provided'
            }
            delete spotDataValues.SpotImages
            delete spotDataValues.createdAt
            delete spotDataValues.updatedAt
            delete spotDataValues.description
        })

        res.json({ "Bookings": bookings })
    } else {
        res.json('No Bookings yet!')
    }

})

//      PUT
router.put('/:bookingId', requireAuth, async (req, res, next) => {

    // gets user info, booking info, spotId of booking, and req.body
    const userId = req.user.id
    const { startDate, endDate } = req.body
    const booking = await Booking.findByPk(req.params.bookingId)

    // console.log(spotIdOfBooking)

    // puts body date string into date format
    const startDateFormat = new Date(startDate)
    const endDateFormat = new Date(endDate)

    // below gets milliseconds from 1970 to start and end date
    const timeToStart = startDateFormat.getTime()
    const timeToEnd = endDateFormat.getTime()

    //get current date milliseconds from 1970
    const today = new Date()
    const todayMS = today.getTime()

    // body validations to make sure end date is after start date
    if (timeToEnd <= timeToStart) {
        res.statusCode = 400
        return res.json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "endDate": "endDate cannot be on or before startDate"
            }
        })
    }
    // making sure booking isn't in the past
    if (timeToEnd <= todayMS) {
        res.statusCode = 403;
        return res.json({
            "message": "Past bookings can't be modified",
            "statusCode": 403
        })
    }

    if (booking) {
        // if the bookings belongs to user
        if (userId === booking.id) {
            // get spotId of the bookings
            const spotIdOfBooking = booking.spotId

            //find all bookings of spot to later check if any conflictions w existing bookings
            const currentBookings = await Booking.findAll({
                where: {
                    spotId: spotIdOfBooking
                }
            })
            for (let booking of currentBookings) {
                console.log({ 'booking': booking })
                // below gets milliseconds from 1970 to start and end dates in booking for that spot
                const timeToBookingStart = booking.startDate.getTime()
                const timeToBookingEnd = booking.endDate.getTime()
                // console.log({'start': timeToBookingStart})
                // console.log({'end': timeToBookingEnd})

                // if the asked booking start date is equal to an already booked start date or between the days of an existing booking
                if (timeToStart === timeToBookingStart || (timeToStart > timeToBookingStart && timeToStart < timeToBookingEnd)) {
                    res.statusCode = 403;
                    return res.json({
                        "message": "Sorry, this spot is already booked for the specified dates",
                        "statusCode": 403,
                        "errors": {
                            "startDate": "Start date conflicts with an existing booking",
                        }
                    })
                }
                // if the asked booking end date is between the days of an existing booking
                if (timeToEnd > timeToBookingStart && timeToEnd <= timeToBookingEnd) {
                    res.statusCode = 403;
                    return res.json({
                        "message": "Sorry, this spot is already booked for the specified dates",
                        "statusCode": 403,
                        "errors": {
                            "endDate": "End date conflicts with an existing booking"
                        }
                    })
                }
                // if the booking fully encompasses days of an existing booking
                if (timeToStart < timeToBookingStart && timeToEnd > timeToBookingEnd) {
                    res.statusCode = 403;
                    return res.json({
                        "message": "Sorry, this spot is already booked for the specified dates",
                        "statusCode": 403,
                        "errors": {
                            "startDate": "Start date conflicts with an existing booking",
                            "endDate": "End date conflicts with an existing booking"
                        }
                    })
                }
            }
            // if it makes it past all checks for each booking on that spot already,
            // adjust the booking
            booking.startDate = startDate;
            booking.endDate = endDate;
            await booking.save()
            res.json(booking)
        }
    } else {
        res.statusCode = 404;
        res.json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    }

})



module.exports = router;
