import { NavLink, useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {useEffect, useState} from 'react'
import { getSpotById } from '../../store/spots';
import {oneSpotsReviews} from '../../store/reviews'
import {postBookingThunk} from '../../store/booking'
import './spotDetails.css'

const SpotDetail = () =>{

const {spotId} = useParams()
// console.log('id',  spotId)
const dispatch = useDispatch()
const history = useHistory()

const [startDate, setStartDate] = useState('')
const [endDate, setEndDate] = useState('')
const [errors, setErrors] = useState([])

const sessionUser = useSelector(state => state.session.user)
console.log('sesh', sessionUser)

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
// const singleReview = reviews[0]

useEffect(() => {
    dispatch(getSpotById(spotId))
    dispatch(oneSpotsReviews(spotId))
}, [dispatch, spotId])

console.log('allreviews', reviews)
console.log('spot id', spot.ownerId)

    if(!spot.SpotImages) return null
    if(!spot.Owner) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        const dataErrors = []

        if(!sessionUser) dataErrors.push('Must be signed in to book')
        if(sessionUser && sessionUser.id === spot.ownerId) dataErrors.push("Can't book your own spot")


        const splitStart = startDate.split('-')
        const splitEnd = endDate.split('-')

        const startYear = Number(splitStart[0])
        const startMonth = Number(splitStart[1])
        const startDay = Number(splitStart[2])

        const endYear = Number(splitEnd[0])
        const endMonth = Number(splitEnd[1])
        const endDay = Number(splitEnd[2])

        if(endYear < startYear) dataErrors.push("End date can't be before start date")
        if(endMonth < startMonth) dataErrors.push("End date can't be before start date")
        if(endDay <= startDay) dataErrors.push("End date can't be before or on the  start date")

        if(dataErrors.length){
            setErrors(dataErrors)
        } else{



        const bookingData = {
            startDate,
            endDate
        }
        console.log('data', bookingData)
        console.log(splitStart)
        console.log(splitEnd)

        const postBooking = await dispatch(postBookingThunk(spotId, bookingData)).catch(
            async (res) => {
              const data = await res.json()
              if(data && data.errors) setErrors(data.errors)
            }
        )
        console.log('res', postBooking)

        if(postBooking){
            history.push('/trips')
        }
    }
    }


    return (
        <div className='wholePage'>
        <div
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
            <div id='topLineUnderPhoto'>
            <div id='intro'>Beautiful spot hosted by {spot.Owner.firstName}</div>
            <NavLink
            id='PostReviewLink'
            // style={{ textDecoration: 'none' }}
            to={`/reviews/${spot.id}/new`}
            >Post a Review</NavLink>
            </div>
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
            <div id='ReviewLocation'>
            <text id='reviewTitleSpotCard'>Reviews</text>
            <div id='reviews'>
                { reviews.length > 0 &&
                <div>
                {reviews.map(review => (
                    <div className='reviewInfo' key={review.review}>
                        <div id='reviewContent'>
                        <div id='reviewFirstName'>{review.User.firstName}</div>
                        {/* <div>{review.stars} </div> */}
                        <div>--      "{review.review}"</div>
                        </div>
                    </div>
                ))}
                </div>}

            </div>
            </div>
        </div>
        <div id='bookings-side'>
                <div id='booking-post'>

                <form  onSubmit={handleSubmit} method="post" id='booking-form'>
                <div id='title-booking'>Start your experience!</div>
                    <div id='pricePerNight'>${spot.price} night</div>

                    <ul>
                        {errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                    <div>CHECK-IN</div>
                     <input
                     type='date'
                     required
                     onChange={(e) => setStartDate(e.target.value)}
                     value={startDate}
                     className='date-inputs'
                     />

                     <div> CHECK-OUT</div>
                     <input
                     required
                     type='date'
                     onChange={(e) => setEndDate(e.target.value)}
                     value={endDate}
                     className='date-inputs'
                     />
                    <button type='submit' id='booking-submit-button'> Reserve</button>

                </form>

                </div>



            </div>
        </div>
    )
}

export default SpotDetail
