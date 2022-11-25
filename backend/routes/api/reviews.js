const express = require('express')

const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const { Spot, Review, SpotImage, User, ReviewImage } = require('../../db/models')

const router = express.Router();

// router.get('/current', requireAuth, async (req, res, next) => {
//     const currentUserId = req.user.id

//     const reviews = await Review.findAll({
//         where:{
//             userId: currentUserId
//         }
//     })

//     res.json(reviews)

// })

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
