import {useDispatch, useSelector} from 'react-redux'
import {useEffect} from 'react'
import {allUserReviews} from '../../store/reviews'
function UserReviews()  {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(allUserReviews())
    }, [dispatch])

    const reviewObj = useSelector(state => {
        return state.reviews.user
    })
    const reviews = Object.values(reviewObj)


    if(!reviews[0].review) return null

return (
    <div id='reviewPage'>

        {reviews.map(review => (
        <div id='reviewBlock'>
            <div className='reviewDetails'>
                <div>{review.stars} </div>
                <div> {review.review}</div>
            </div>
            <button> Delete Review</button>
        </div>
        ))
        }
    </div>
)
}


export default UserReviews
