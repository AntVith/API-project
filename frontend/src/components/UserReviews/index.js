import {useDispatch, useSelector} from 'react-redux'
import {useEffect} from 'react'
import {allUserReviews, deleteAReview} from '../../store/reviews'
import './userReviews.css'

function UserReviews()  {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(allUserReviews())
    }, [dispatch])

    const reviewObj = useSelector(state => {
        return state.reviews.user
    })
    const reviews = Object.values(reviewObj)
    let message = ''
    const DeleteReview = async (id) => {
        const response = await dispatch(deleteAReview(id))

        if(response){
             message = response.message
        }

    }


    if(!reviews.length) return null

return (
    <div id='reviewPage'>
        <div id='reviewColumn'>
        {message.length > 0 &&
        <div>{message}</div>
        }
        <text id='reviewTitle'>My reviews</text>

        { reviews.length > 0 &&
        <div id='allReviews'>
        {reviews.map(review => (

        <div id='reviewBlock'
        key={review.id}
        >   <div id='wholeAddress'>
            <div id='address'>
                {review.Spot.address}
            </div>
            <div id='cityState'>
                <div className='reviewLocation'>{review.Spot.city}, </div>
                <div className='reviewLocation'>{review.Spot.state}, </div>
                <div className='reviewLocation'>{review.Spot.country} </div>
                </div>
                </div>
            <div className='reviewDetails'>
                <div id='reviewStars'>
                    <p id='ratingLabel'>Rating:</p>
                    <div id='RatingInfo'>
            <div id='StarInfo'>
            <i
             id='star'
            className="fa-solid fa-star"></i>
                <div id='starRating'>{review.stars} </div>
                </div>
                </div>
                </div>
                <div id='messageWhole'>
                <p id='messageLabel'>Review:</p>
                <div id='reviewReview'> {review.review}</div>
                </div>

            <button id='deleteReviewButton' onClick={() => DeleteReview(review.id)}> Delete Review</button>
            </div>
        </div>
        ))}
        </div>
        }
        </div>
    </div>
)
}


export default UserReviews
