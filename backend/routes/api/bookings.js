const express = require('express')

const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const { Booking, Spot, Review, SpotImage, User, ReviewImage } = require('../../db/models')

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id
    let final = []

    const bookings = await Booking.findAll({
        where:{
            userId
        },
        include:[
            {
                model:Spot,
                include:{
                    model:SpotImage
                }
            }
        ]
    })
    if(bookings){

        bookings.forEach(booking => {
            let spotDataValues = booking.Spot.dataValues

            if(spotDataValues.SpotImages.length){
                spotDataValues.SpotImages.forEach(spotImage => {
                    if(spotImage.preview){
                        spotDataValues.previewImage = spotImage.url
                    }
                })

            }
            if(!spotDataValues.previewImage){
                spotDataValues.previewImage = 'No Preview Image Provided'
            }
            delete spotDataValues.SpotImages
            delete spotDataValues.createdAt
            delete spotDataValues.updatedAt
            delete spotDataValues.description
        })

        res.json({"Bookings":bookings})
    } else{
        res.json('No Bookings yet!')
    }

})



module.exports = router;
