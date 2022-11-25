const express = require('express')

const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const { Spot, Review, SpotImage, User } = require('../../db/models')

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
    const currentUserId = req.user.id

    const reviews = await Review.findAll({
        where:{
            userId: currentUserId
        }
    })

    res.json(reviews)

})


module.exports = router;
