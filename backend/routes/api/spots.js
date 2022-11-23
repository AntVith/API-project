const express = require('express')

const sequelize = require('sequelize')

const { Spot, Review, SpotImage, User } = require('../../db/models')

const router = express.Router();


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




module.exports = router;
