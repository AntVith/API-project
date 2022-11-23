const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Username is required'),
  check('firstName')
  .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage("Last Name is required"),
  handleValidationErrors
];

// took out validateSignup from params in post request, it went right after url
// Sign up
router.post(
    '/', validateSignup,
    async (req, res, next) => {
      const { firstName, lastName, email, password, username } = req.body;

      const notValidEmail = await User.findAll({
        where:{
          email
        }
      })
      const notValidUsername = await User.findAll({
        where: {
          username
        }
      })
      if(notValidEmail.length){
        console.log(notValidEmail)
        let err = new Error()
        err.message = "User already exists"
        err.statusCode = 403
        err.errors = {
          "email": "User with that email already exists"
        }
        next(err)

      } else if(notValidUsername.length){
        console.log(notValidUsername)
        let err = new Error()
        err.message = "User already exists"
        err.statusCode = 403
        err.errors = {
          "username": "User with that username already exists"
        }
        next(err)

      } else{
      const user = await User.signup({ firstName, lastName, email, username, password });

      const token = await setTokenCookie(res, user);

      // console.log()

      return res.json({
        'id': user.id,
        firstName,
        lastName,
        email,
        username,
        token
      });
      }

    }
  );

  router.use((err, req, res, next) =>{
    console.log(err)
    res.statusCode = err.statusCode
    res.send(err)
  })

module.exports = router;
