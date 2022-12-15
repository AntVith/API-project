import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {useEffect} from 'react'
import { getSpotById } from '../../store/spots';
import {oneSpotsReviews} from '../../store/reviews'
import './spotDetails.css'

const SpotDetail = () =>{

const {spotId} = useParams()
// console.log('id',  spotId)
const dispatch = useDispatch()

const spot = useSelector(state => {
    return state.spots.singleSpot
})
// console.log('spot', spot)
const reviewsResponse = useSelector(state => {
    return state.reviews.spot
})
const reviews = Object.values(reviewsResponse)
// console.log('review component', reviewsResponse)
// console.log('review', reviews)

useEffect(() => {
    dispatch(getSpotById(spotId))
    dispatch(oneSpotsReviews(spotId))
}, [dispatch, spotId])


if(!spot.SpotImages) return null
if(!spot.Owner) return null
if(!reviewsResponse) return null
    return (
        <div className='wholePage'>
        <div id={spot.id}
        className='SpotDetailCard'
        >
            <div id='aboveImage'>
                <div id='spotName'>{spot.name}</div>
                <div id='reviewInfo'>
                <div id='starRating'>
                <i id='star'
                className="fa-solid fa-star"></i>
                    {spot.avgStarRating}</div>
                <div id='numReviews'>{spot.numReviews} reviews</div>
                <div id='location'>{spot.city}, {spot.state}, {spot.country}</div>
                </div>
            </div>
            <div id='images'>{spot.SpotImages.map(image => (
                <img
                id={`image${spot.id}`}
                className='spotImages'
                src={image.url}></img>
            ))}
            </div>
            <div id='intro'>Beautiful spot hosted by {spot.Owner.firstName}</div>
            <div id='description'>{spot.description}</div>

            <div id='info'>
                <div id='checkin'>
                <i
                id='doorImage'
                className="fa-solid fa-door-open"></i>
                <div id='checkinText'>
                    <div>Self check-in</div>
                    <div>Check yourself in with the lockbox</div>
                </div>
                </div>
                <div id='second'>

                <i
                id='calender'
                className="fa-solid fa-calendar-days"></i>
                <div id='cancellation'>
                    <div>Free cancellation for 48 hours</div>
                </div>
                </div>

            </div>
            <div id='reviews'>
                {reviews.map(review => (
                    <div className='reviewInfo'>
                        <div>{review.User.firstName}</div>
                        <div>{review.stars} </div>
                        <div>{review.review}</div>
                    </div>
                ))}
            </div>
        </div>
        </div>
    )
}

export default SpotDetail
