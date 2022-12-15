import {useDispatch, useSelector} from 'react-redux'
import {useEffect} from 'react'
import {allUserReviews, deleteAReview} from '../../store/reviews'
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
        {message.length > 0 &&
        <div>{message}</div>
        }

        { reviews.length > 0 &&
        <div>
        {reviews.map(review => (
        <div id='reviewBlock'
        key={review.id}
        >
            <div className='reviewDetails'>
                <div>{review.stars} </div>
                <div> {review.review}</div>
            </div>
            <button onClick={() => DeleteReview(review.id)}> Delete Review</button>
        </div>
        ))}
        </div>
        }
    </div>
)
}


export default UserReviews
