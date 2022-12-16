import { useParams } from "react-router-dom"
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect } from "react";
import {CreateNewReview} from '../../store/reviews'
import './createReview.css'

function CreateReview() {
    const {spotId} = useParams()

    const [review, setReview] = useState('')
    const [stars, setStars] = useState(5)
    const [validationErrors, setValidationErrors] = useState([])

    const dispatch = useDispatch()
    const history = useHistory()

    const userInfo = useSelector(state => {
        return state.session.user
    })
    const User = {
       id: userInfo.id,
       firstName:userInfo.firstName,
       lastName: userInfo.lastName
    }
    const spotInfo = useSelector(state => {
        return state.spots.singleSpot
    })
    // console.log('info', spotInfo)
    let previewImage;
    if(spotInfo){
     spotInfo.SpotImages.forEach(flic => {
        if(flic.preview){
            previewImage = flic.url
        }
     })
    }
    const Spot = {
        id: spotInfo.id,
        ownerId: spotInfo.Owner.id,
        address: spotInfo.address,
        city: spotInfo.city,
        state: spotInfo.state,
        country: spotInfo.country,
        lat: spotInfo.lat,
        lng: spotInfo.lng,
        name: spotInfo.name,
        price: spotInfo.price,
        previewImage: previewImage
    }

    const userReviewsObj = useSelector(state => {
        return state.reviews.user
    })
    const userReviews = Object.values(userReviewsObj)

    let doubleReview = ''
    userReviews.forEach(review =>{
        if(review.spotId === Spot.id){
            doubleReview = true
        }
    })

    useEffect(() => {
        let validRating = [1, 2, 3, 4, 5]
        let errors = []

        if(!review) errors.push('Need a review comment')
        if(!stars) errors.push('Need a star Rating')
        if(stars > 5 || stars < 0) errors.push('Star rating must be between 0 and 5')
        if(!validRating.includes(Number(stars))) errors.push('Star rating must be a valid number')
        if(User.id === Spot.ownerId) errors.push("Can't make a review on your own spot!")
        if(doubleReview) errors.push('Already made a review for this spot!')
        setValidationErrors(errors)
    }, [review, stars])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newReview = {
            review,
            stars
        }

        const response = await dispatch(CreateNewReview(spotId, User, Spot,  newReview))

        if(response){
            history.push(`/spots/${spotId}`)
        }
    }

    return (
        <div id='wholeReviewFormPage'>
            <div id='formDiv'>
            <form
            id='reviewForm'
            onSubmit={handleSubmit}
            >
            <p id='reviewTitle'> How was your stay? </p>
            <div id='errorMessages'>
            {validationErrors.map(error => (
                <div
                key={error}
                >{error}</div>
            ))}
            </div>
            <label>
            {/* Review: */}
            <input
            type='text'
            className='inputArea'
            onChange={(e) => setReview(e.target.value)}
            value={review}
            placeholder='Comments go here'
            name='review'
            />
            </label>

            <label>
            {/* Stars: */}
            <input
            type='integer'
            className='inputArea'
            onChange={(e) => setStars(e.target.value)}
            value={stars}
            placeholder='Star Rating'
            name='stars'
            />
            </label>

            <label>
            <button
             type='submit'
             id='submitButton'
             disabled={validationErrors.length > 0}
             >Submit</button>
            </label>

            </form>
            </div>
        </div>
    )
}

export default CreateReview
