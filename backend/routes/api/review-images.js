const express = require('express')

const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const { Booking, Spot, Review, SpotImage, User, ReviewImage } = require('../../db/models')

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {

    const userId = req.user.id;

    const reviewImage = await ReviewImage.findByPk(req.params.imageId)
    // console.log(reviewImage.reviewId)

    if(reviewImage){
        const review = await Review.findByPk(reviewImage.reviewId)
        console.log(review.userId)

        if(userId === review.userId){
            await reviewImage.destroy()
            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
              })
        }

    } else{
        res.statusCode = 404;
        res.json({
            "message": "Review Image couldn't be found",
            "statusCode": 404
          })
    }
})



module.exports = router;
