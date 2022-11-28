const express = require('express')

const sequelize = require('sequelize')

const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models')

const router = express.Router();

//      POST

//create booking based off spotID
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {

    const spot = await Spot.findByPk(req.params.spotId)
    const { startDate, endDate } = req.body
    const userId = req.user.id

    // puts date string into date format
    const startDateFormat = new Date(startDate)
    const endDateFormat = new Date(endDate)

    // below gets milliseconds from 1970 to date
    const timeToStart = startDateFormat.getTime()
    const timeToEnd = endDateFormat.getTime()

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
    // finding all bookings for spot
    const bookingsForSpot = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        }
    })


    // if spot exists
    if (spot) {
        // if user isn't owner
        if (userId !== spot.ownerId) {
            // if bookings exist for the spot
            if (bookingsForSpot) {
                // check to see if the requested days conflict with an existing booking
                for (let booking of bookingsForSpot) {
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
                // if it makes it past all checks for each booking on that spot already
                const newBooking = await Booking.create({
                    spotId: Number(req.params.spotId),
                    userId,
                    startDate,
                    endDate
                })
                res.json(newBooking)
            } else {
                // if no bookings, create the booking
                const newBooking = await Booking.create({
                    spotId: Number(req.params.spotId),
                    userId,
                    startDate,
                    endDate
                })
                res.json(newBooking)
            }
        } else {
            res.statusCode = 400;
            res.json("Can't book at your own Spot!")
        }
    } else {
        res.statusCode = 404;
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage("Review text is required"),
    check('stars')
        .exists({ checkFalsy: true })
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];
// post a review based on spotID
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    const userId = req.user.id

    const { review, stars } = req.body

    if (spot) {
        const checkForExistingReview = await Review.findOne({
            where: {
                userId,
                spotId: spot.id
            }
        })

        if (checkForExistingReview) {
            res.statusCode = 403;
            res.json({
                "message": "User already has a review for this spot",
                "statusCode": 403
            })
        } else {
            const newReview = await Review.create({
                userId,
                spotId: spot.id,
                review,
                stars
            })
            res.statusCode = 201;
            res.json(newReview)
        }
    } else {
        res.statusCode = 404;
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

})

// adding an image to a spot based on Spot Id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {

    const { url, preview } = req.body
    const userId = req.user.id
    // console.log( {'userID': userId})

    const owner = await User.findByPk(userId)
    // console.log({'ownerID': owner.id})

    const spotId = req.params.spotId
    const spotRequested = await Spot.findByPk(spotId)
    // console.log({"Spot requested": spotRequested})

    if (spotRequested) {
        if (userId === owner.id) {
            const newImage = await SpotImage.create({
                spotId,
                url,
                preview
            })
            const response = {
                'id': newImage.id,
                url,
                preview
            }

            res.json(response)
        } else {
            res.statusCode = 400
            res.json('Not Owner')
        }
    } else {
        // console.log('failed', spotId)
        res.statusCode = 404
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})

// validate sign up used for creating a new user route below
const validateSignUp = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage("Street address is required"),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage("State is required"),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage("Country is required"),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage("Latitude is not  valid"),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage("Longitude is not  valid"),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage("Description is required"),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage("Price per day is required"),
    handleValidationErrors
]

// create a new spot
router.post('/', requireAuth, validateSignUp, async (req, res, next) => {


    const { address, city, state, country, lat, lng, name, description, price } = req.body

    // console.log('reqUSerid', req.user.id)

    const newSpot = await Spot.create({
        "ownerId": req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    res.statusCode = 201
    res.json(newSpot)
})

//       PUT
// edit a spot
router.put('/:spotId', requireAuth, validateSignUp, async (req, res, next) => {

    const currentUserId = req.user.id

    const { address, city, state, country, lat, lng, name, description, price } = req.body

    const spot = await Spot.findByPk(req.params.spotId)

    if (spot) {
        const ownerId = spot.ownerId

        if (currentUserId === ownerId) {
            console.log('success')
            if (address) spot.address = address;
            if (city) spot.city = city;
            if (state) spot.state = state;
            if (country) spot.country = country;
            if (lat) spot.lat = lat;
            if (lng) spot.lng = lng;
            if (name) spot.name = name;
            if (description) spot.description = description;
            if (price) spot.price = price;

            await spot.save()

            res.json(spot)
        }

    } else {
        res.statusCode = 404
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})

//       GET

// get all bookings for a spot based on spot id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {

    const userId = req.user.id

    const spotInfo = await Spot.findByPk(req.params.spotId)
    // console.log(spotInfo)


    // if (!spotInfo) {
    //     res.statusCode = 404;
    //     return res.json({
    //         "message": "Spot couldn't be found",
    //         "statusCode": 404
    //     })
    // }


    const bookingsForCustomer = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        },
        include: [
            {
                model: User
            },

        ]
    })
    // if spot exists
    if (spotInfo) {
        if (bookingsForCustomer.length) {
            const ownerOfSpot = spotInfo.dataValues.ownerId
            // if the user is the owner of the house
            if (userId === ownerOfSpot) {
                // take out username from user object
                bookingsForCustomer.forEach(booking => {
                    let userDataValues = booking.User.dataValues

                    delete userDataValues.username
                })

                res.json({ 'Bookings': bookingsForCustomer })
            } else {
                // if user is not owner
                // delete extra info
                bookingsForCustomer.forEach(booking => {
                    // console.log(booking)
                    delete booking.dataValues.id
                    delete booking.dataValues.User
                    delete booking.dataValues.userId
                    delete booking.dataValues.createdAt
                    delete booking.dataValues.updatedAt
                })
                res.json({ 'Bookings': bookingsForCustomer })
            }
        } else {
            // no bookings
            res.json('No bookings yet!')
        }
    } else {
        // no spot
        res.statusCode = 404;
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }


})

// get all reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res, next) => {
    const reviews = await Review.findAll({
        where: {
            spotId: req.params.spotId
        },
        include: [
            {
                model: User
            },
            {
                model: ReviewImage
            }
        ]
    })
    const spot = await Spot.findByPk(req.params.spotId)

    // if the spot exists
    if (spot) {
        // take out username from user object
        reviews.forEach(review => {
            let userDataValues = review.User.dataValues

            delete userDataValues.username
        })
        // only include id and url in ReviewImages object
        reviews.forEach(review => {
            if (review.ReviewImages.length) {
                review.ReviewImages.forEach(reviewImage => {
                    let reviewImageDataValues = reviewImage.dataValues
                    // console.log(reviewImageDataValues)
                    reviewImage.dataValues = {
                        'id': reviewImageDataValues.id,
                        'url': reviewImageDataValues.url
                    }
                })
            }
        })
        res.json({ "Reviews": reviews })
    } else {
        res.statusCode = 404;
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})

// get all spots owned by current user
router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id

    // console.log({"userId": userId})

    const allSpots = await Spot.findAll({
        where: {
            ownerId: userId
        },
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    })

    let houseList = []
    allSpots.forEach(house => {
        houseList.push(house.toJSON())
    })
    // below is looping thru each house to find ratings and avg them
    houseList.forEach(house => {
        let sum = 0
        let count = 0
        // console.log('new star')
        for (let review of house.Reviews) {
            // console.log("star", review.stars)
            sum += review.stars
            count++
        }
        let avg = sum / count
        console.log('(sum/count)', (sum / count))
        if (isNaN(avg)) {
            house.avgRating = 'No ratings yet!'
        } else {
            house.avgRating = avg
        }

        delete house.Reviews
    })
    houseList.forEach(house => {
        house.SpotImages.forEach(image => {
            // console.log('image', image)
            if (image.preview) {
                house.previewImage = image.url
            } else {
                house.previewImage = 'PREVIEW IMAGE NOT PROVIDED'
            }
        })
        // console.log({'previewimage': house.previewImage})
        if (!house.previewImage) {
            house.previewImage = 'PREVIEW IMAGE NOT PROVIDED'
        }
        delete house.SpotImages
    })

    res.json({ "Spots": houseList })
})
// get spot by id
router.get('/:spotId', async (req, res, next) => {
    let info = []
    const spotId = Number(req.params.spotId)

    // console.log(typeof spotId)

    const spot = await Spot.findOne({
        where: {
            id: spotId
        },
        include: [
            {
                model: Review
            },
            {
                model: SpotImage,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'spotId']
                }
            }
        ]
    })

    console.log(spot)
    if (spot) {
        info.push(spot.toJSON())

        // below is getting info on owner of spot
        // console.log('ownerid', spot.ownerId)
        const ownerInfo = await User.findOne({
            where: {
                id: spot.ownerId
            },
            attributes: {
                exclude: ['username']
            }
        })

        // below adds the num of reviews key and value as well as
        // the avg star ratings
        info.forEach(house => {
            let sum = 0
            let count = 0
            // console.log('new star')
            for (let review of house.Reviews) {
                // console.log("star", review.stars)
                sum += review.stars
                count++
            }
            house.numReviews = count

            let avg = sum / count
            // console.log('(sum/count)', (sum / count))
            if (isNaN(avg)) {
                house.avgStarRating = 'No ratings yet!'
            } else {
                house.avgStarRating = avg
            }
            delete house.Reviews
        })
        //  below puts spot image into right place in list of attributes
        // order ins't guaranteed but when i do this it comes out as wanted
        const spotImageInfo = info[0].SpotImages
        delete info[0].SpotImages;
        info[0].SpotImages = spotImageInfo

        // below adds owner information to object to be returned
        info[0].Owner = ownerInfo

        // doing info[0] below takes out array brackets of info, api docs don't want
        // the array brackets
        res.json(info[0])

    } else {
        res.statusCode = 404
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})


// get all spots
router.get('/', async (req, res, next) => {

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query

    if(page){
        page = Number(page)
        if(isNaN(page) || page < 1){
            res.statusCode = 400;
            return res.json({
                "message": "Validation Error",
                "statusCode": 400,
                "errors": {
                  "page": "Page must be greater than or equal to 1",
                }
            })
        }
    }
    if(size){
        size = Number(size)
        if(isNaN(size) || size < 1){
            res.statusCode = 400;
            return res.json({
                "message": "Validation Error",
                "statusCode": 400,
                "errors": {
                    "size": "Size must be greater than or equal to 1",
                }
            })
        }
    }
    if(minLat){
        minLat = Number(minLat)
        if(isNaN(minLat)){
            res.statusCode = 400;
            return res.json({
                "message": "Validation Error",
                "statusCode": 400,
                "errors": {
                    "minLat": "Minimum latitude is invalid",
                }
            })
        }
    }
    if(maxLat){
        maxLat = Number(maxLat)
        if(isNaN(maxLat)){
            res.statusCode = 400;
            return res.json({
                "message": "Validation Error",
                "statusCode": 400,
                "errors": {
                    "maxLat": "Maximum latitude is invalid",
                }
            })
        }
    }
    if(minLng){
        minLng = Number(minLng)
        if(isNaN(minLng)){
            res.statusCode = 400;
            return res.json({
                "message": "Validation Error",
                "statusCode": 400,
                "errors": {
                    "minLng": "Minimum longitude is invalid",
                }
            })
        }
    }
    if(maxLng){
        maxLng = Number(maxLng)
        if(isNaN(maxLng)){
            res.statusCode = 400;
            return res.json({
                "message": "Validation Error",
                "statusCode": 400,
                "errors": {
                    "maxLat": "Maximum longitude is invalid",
                }
            })
        }
    }
    if(minPrice){
        minPrice = Number(minPrice)
        if(isNaN(minPrice) || minPrice < 0){
            res.statusCode = 400;
            return res.json({
                "message": "Validation Error",
                "statusCode": 400,
                "errors": {
                    "minPrice": "Minimum price must be greater than or equal to 0"
                }
            })
        }
    }
    if(maxPrice){
        maxPrice = Number(maxPrice)
        if(isNaN(maxPrice) || maxPrice < 0){
            res.statusCode = 400;
            return res.json({
                "message": "Validation Error",
                "statusCode": 400,
                "errors": {
                    "maxPrice": "Maximum price must be greater than or equal to 0",
                }
            })
        }
    }

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(size) || size < 1) size = 20;

    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ],
        limit: size,
        offset: size * (page - 1)
    })
    let houseList = []
    spots.forEach(house => {
        houseList.push(house.toJSON())
    })
    // below is looping thru each house to find ratings and avg them
    houseList.forEach(house => {
        let sum = 0
        let count = 0
        // console.log('new star')
        for (let review of house.Reviews) {
            // console.log("star", review.stars)
            sum += review.stars
            count++
        }
        let avg = sum / count
        // console.log('(sum/count)', (sum / count))
        if (isNaN(avg)) {
            house.avgRating = 'No ratings yet!'
        } else {
            house.avgRating = avg
        }
        delete house.Reviews
    })
    houseList.forEach(house => {
        house.SpotImages.forEach(image => {
            // console.log('image', image)
            if (image.preview) {
                house.previewImage = image.url
            } else {
                house.previewImage = 'PREVIEW IMAGE NOT PROVIDED'
            }
        })
        if (!house.previewImage) {
            house.previewImage = 'PREVIEW IMAGE NOT PROVIDED'
        }
        delete house.SpotImages
    })

    res.status = 200
    res.json(
    {
        "Spots": houseList,
        page,
        size
    })

})

//      DELETE

// delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    const currentUserId = req.user.id

    if (spot) {
        const ownerId = spot.ownerId
        if (currentUserId === ownerId) {
            await spot.destroy()

            res.statusCode = 200;
            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
            })
        }

    } else {
        res.statusCode = 404
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})


router.use((err, req, res, next) => {
    console.log(err)
    res.statusCode = err.statusCode
    res.send(err)
})



module.exports = router;
