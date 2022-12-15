import { csrfFetch } from "./csrf";

const REVIEWS_FOR_SPOT = 'reviews/REVIEWS_FOR_SPOT'
const spotReviews = (reviews) => ({
    type: REVIEWS_FOR_SPOT,
    reviews
})

const REVIEWS_FOR_USER = 'review/REVIEWS_FOR_USER'
const userReviews = (reviews) =>({
    type: REVIEWS_FOR_USER,
    reviews
})

const DELETE_REVIEW = '/review/DELETE_REVIEW'
const deleteReview = (id) => ({
    type: DELETE_REVIEW,
    id
})

export const oneSpotsReviews = (id) => async(dispatch) =>{
    const response = await csrfFetch(`/api/spots/${id}/reviews`)

    if(response.ok){
        const reviews = await response.json()
        dispatch(spotReviews(reviews))
        return reviews
    }
}

export const allUserReviews = () => async(dispatch) =>{
    const response = await csrfFetch('/api/reviews/current')

    if(response.ok){
        const reviews = await response.json()
        dispatch(userReviews(reviews))
    }
}

export const deleteAReview = (id) => async(dispatch) =>{
    const response = await csrfFetch(`/api/reviews/${id}`)

    if(response.ok){
        const message = response.json()
        dispatch(deleteReview(id))
    }
}

const initialState = {spot: {}, user: {}}
const reviewReducer = (state=initialState, action) => {
    switch(action.type){
        case REVIEWS_FOR_SPOT:{
        const newState = {...state}
        const spotReviews = {}
        // console.log('review spot reducer', action.reviews)
        action.reviews.Reviews.forEach(review => spotReviews[review.id] = review)
        newState.spot = spotReviews
        return newState
        }
        case REVIEWS_FOR_USER:{
            const newState = {...state}
            const userReviews = {}
            action.reviews.Reviews.forEach(review => userReviews[review.id] = review)
            newState.user = userReviews
            return newState
        }
        case DELETE_REVIEW:{
            const newState = {...state}
            const spotReviews = {...state.spot}
            const userReviews = {...state.user}
            delete spotReviews[action.id]
            delete userReviews[action.id]
            newState.spot = spotReviews
            newState.user = userReviews
            return newState
        }



        default:
            return state
    }
}

export default reviewReducer
