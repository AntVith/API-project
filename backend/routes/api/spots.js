const express = require('express')

const sequelize = require('sequelize')

const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const { Spot, Review, SpotImage, User } = require('../../db/models')

const router = express.Router();

//      POST

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

    const {address, city, state, country, lat, lng, name, description, price} = req.body

    const spot = await Spot.findByPk(req.params.spotId)

    if (spot) {
        const ownerId = spot.ownerId

        if (currentUserId === ownerId) {
            console.log('success')
            if(address) spot.address = address;
            if(city) spot.city = city;
            if(state) spot.state = state;
            if(country) spot.country = country;
            if(lat) spot.lat = lat;
            if(lng) spot.lng = lng;
            if(name) spot.name = name;
            if(description) spot.description = description;
            if(price) spot.price = price;

            await spot.save()

            res.json(spot)
        }

    } else{
        res.statusCode = 404
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }
})

//       GET

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

    const spots = await Spot.findAll({
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
            console.log('image', image)
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
    res.json({ "Spots": houseList })
})

//      DELETE

// delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    const currentUserId = req.user.id

    if(spot){
        const ownerId = spot.ownerId
        if(currentUserId === ownerId){
            await spot.destroy()

            res.statusCode = 200;
            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
              })
        }

    } else{
        res.statusCode = 404
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
} )


router.use((err, req, res, next) => {
    console.log(err)
    res.statusCode = err.statusCode
    res.send(err)
})



module.exports = router;
