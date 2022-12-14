import {csrfFetch} from './csrf'


const LOAD_ALL_SPOTS = 'spots/LOAD_ALL'
const loadAllSpots = (allSpots) => ({
    type: LOAD_ALL_SPOTS,
    payload: allSpots
})

const LOAD_ONE_SPOT = 'spots/LOAD_ONE_SPOT'
const loadOneSpot = (spot) => ({
    type:LOAD_ONE_SPOT,
    payload: spot
})

const CREATE_SPOT = 'spots/CREATE_SPOT'
const createASpot = (newSpot) => ({
    type: CREATE_SPOT,
    newSpot
})

const DELETE_SPOT = 'spots/DELETE_SPOT'
const deleteASpot = (id) => ({
    type: DELETE_SPOT,
    id
})

export const DeleteOneSpot = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}`, {
        method:'DELETE'
    })
    console.log('made to thunk')
    if(response.ok){
        const message = await response.json()
        dispatch(deleteASpot(id))
        return message
    }
}

export const CreateNewSpot = (newSpot, newSpotImage) => async (dispatch) =>{
    const responseSpot = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSpot)
    })

    if(responseSpot.ok){
        //
        const newSpot = await responseSpot.json()
        // console.log('newSpot', newSpot)

        // adding the spot id key to the spot image before sending to post
        newSpotImage['spotId'] = newSpot.id

        const responseSpotImage = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSpotImage)
        })

        if(responseSpotImage.ok){
            const newImage = await responseSpotImage.json()
            // console.log('newImage', newImage)
            const finalInfo = {...newSpot, "previewImage": newImage.url}
            console.log('final', finalInfo)
            dispatch(createASpot(finalInfo))
            return finalInfo
        }
    }
}

export const getSpotById = (id) => async(dispatch) =>{
    const response = await csrfFetch(`/api/spots/${id}`)
    console.log('spot action creator working')

    if(response.ok){
        const spot = await response.json()
        dispatch(loadOneSpot(spot))
    }
}

export const getAllSpots = () => async(dispatch) =>{
    const response = await csrfFetch('/api/spots')
    console.log('response', response)

    if(response.ok){
        const allSpots = await response.json()
        dispatch(loadAllSpots(allSpots))
    }
}



const initialState = {allSpots: {}, singleSpot: {}}
const spotReducer = (state = initialState, action) =>{
    switch(action.type){
        case LOAD_ALL_SPOTS:
            const copy = {allSpots:{}, singleSpot:{}}
            console.log(action.payload)
            action.payload.Spots.forEach(spot => copy.allSpots[spot.id] = spot)
            return copy
        case LOAD_ONE_SPOT:
            const copy1 = {allSpots:{}, singleSpot:{}}
            copy1.singleSpot = action.payload
            return copy1
        case CREATE_SPOT:
            const copy2 = {...state}
            const allSpotsCopy = {...state.allSpots}
            allSpotsCopy[action.newSpot.id] = action.newSpot
            copy2.allSpots = allSpotsCopy
            return copy2
        case DELETE_SPOT:
            console.log('made to reducer')
            const copy3 = {...state}
            const allSpotsCopy1 = {...state.allSpots}
            console.log('pre delete', allSpotsCopy1)
            delete allSpotsCopy1[action.id]
            console.log('post delete', allSpotsCopy1)
            copy3.allSpots = allSpotsCopy1
            return copy3
        default:
            return state
    }
}

export default spotReducer
