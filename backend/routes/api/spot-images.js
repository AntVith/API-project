const express = require('express')

const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const { Booking, Spot, Review, SpotImage, User, ReviewImage } = require('../../db/models')

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res, next) => {

    const userId = req.user.id
    console.log(typeof userId)

    const image = await SpotImage.findByPk(req.params.imageId)

    if(image){
        //find spot to compare owner to user
        const spot = await Spot.findByPk(image.spotId)
        // console.log(typeof spot.ownerId)
        if(userId === spot.ownerId){
            await image.destroy()

            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
              })
        }

    } else{
        res.statusCode = 404;
        res.json({
            "message": "Spot Image couldn't be found",
            "statusCode": 404
          })
    }
})




module.exports = router;
