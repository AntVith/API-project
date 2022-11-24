const express = require('express')

const sequelize = require('sequelize')

const {requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const { Spot, Review, SpotImage, User } = require('../../db/models')

const router = express.Router();


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


router.post('/', requireAuth, validateSignUp, async (req, res, next) => {


    const {address, city, state, country, lat, lng, name, description, price} = req.body

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
    spots.forEach( house => {
        houseList.push(house.toJSON())
    })
    // below is looping thru each house to find ratings and avg them
    houseList.forEach( house => {
        let sum = 0
        let count = 0
        // console.log('new star')
        for(let review of house.Reviews){
            // console.log("star", review.stars)
            sum += review.stars
            count++
        }
        house.avgRating = sum/count
        delete house.Reviews
    })
    houseList.forEach(house => {
        house.SpotImages.forEach( image => {
            console.log('image', image)
            if (image.preview){
                house.previewImage = image.url
            } else {
                house.previewImage = 'PREVIEW IMAGE NOT PROVIDED'
            }
        })
        delete house.SpotImages
    })

    res.status = 200
    res.json({ "Spots": houseList })
})


router.use((err, req, res, next) =>{
    console.log(err)
    res.statusCode = err.statusCode
    res.send(err)
  })

module.exports = router;
