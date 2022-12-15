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
const CREATE_REVIEW = '/review/CREATE_REVIEW'
const createReview = (final) => ({
    type:CREATE_REVIEW,
    final
})

export const CreateNewReview = (spotId, User, Spot, newReview) => async(dispatch) =>{
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
    })

    if(response.ok){
        const review = await response.json()
        console.log('new review', review)
        review['ReviewImages'] = [] // added the reviewImages key and empty array value to review object
        //add user and that's good for review spot id
        review['User'] = User
        //then spread that object into new object and add spot details
        const reviewForCurrentUser = {...review}
        reviewForCurrentUser['Spot'] = Spot
        //then pass both objects in as key value pair in new object to pass to reducer to add to state
        const final = {}
        final["spotReviews"] = review
        final['userReviews'] = reviewForCurrentUser
        dispatch(createReview(final))
        return(review)
    }
}

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
    const response = await csrfFetch(`/api/reviews/${id}`, {
        method:'DELETE'
    })

    if(response.ok){
        const message = response.json()
        dispatch(deleteReview(id))
        return message
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
        case CREATE_REVIEW:{
            const newState = {...state}
            const spotReviews = {...state.spot}
            const userReviews = {...state.user}
            spotReviews[action.final.spotReviews.id] = action.final.spotReviews
            userReviews[action.final.userReviews.id] = action.final.userReviews
            newState.spot = spotReviews
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
