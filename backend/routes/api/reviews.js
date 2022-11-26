const express = require('express')

const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const { Spot, Review, SpotImage, User, ReviewImage } = require('../../db/models')

const router = express.Router();
// get reviews of current user
router.get('/current', requireAuth, async (req, res, next) => {
    const currentUserId = req.user.id

    const reviews = await Review.findAll({
        where: {
            userId: currentUserId
        },
        include: [
            {
                model: User
            },
            {
                model: Spot,
                include:{
                    model:SpotImage
                }
            },
            {
                model: ReviewImage
            }
        ]
    })
    // below changes whole user object to just fields necessary
    reviews.forEach(review => {
        let userDataValues = review.User.dataValues

        delete userDataValues.username
    })

    // below changes the spot object to include all fields necessary
    reviews.forEach(review => {
        let spotDataValues = review.Spot.dataValues

        if(spotDataValues.SpotImages.length){
            spotDataValues.SpotImages.forEach(spotImage => {
                if(spotImage.preview){
                    spotDataValues.previewImage = spotImage.url
                }
            })

        }
        if(!review.previewImage){
            review.previewImage = 'No Preview Image Provided'
        }
        delete spotDataValues.SpotImages
        delete spotDataValues.createdAt
        delete spotDataValues.updatedAt
        delete spotDataValues.description
    })

    // below changes review Images objects in array to include just fields necassary
    reviews.forEach(review =>{
        if(review.ReviewImages.length){
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

})
// create an image for a review
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const { url } = req.body;
    const reviewId = req.params.reviewId
    const userId = req.user.id

    const review = await Review.findByPk(reviewId)

    const amountOfReviewImages = await ReviewImage.findAll({
        where: {
            reviewId
        }
    })

    if (review) {
        if (review.userId === userId) {
            // if there are less than 10 reviewimages for this review (10 is cap) OR there are none
            if (amountOfReviewImages.length < 10 || !amountOfReviewImages) {
                const newReviewImage = await ReviewImage.create({
                    reviewId,
                    url
                })
                const returnObject = {
                    'id': newReviewImage.id,
                    'url': newReviewImage.url
                }
                res.json(returnObject)

            } else {
                res.statusCode = 403;
                res.json({
                    "message": "Maximum number of images for this resource was reached",
                    "statusCode": 403
                })
            }
        }
    } else {
        res.statusCode = 404;
        res.json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    }
})


module.exports = router;
