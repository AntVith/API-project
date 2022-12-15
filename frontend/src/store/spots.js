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
const EDIT_SPOT = '/spots/EDIT_SPOT'
const editASpot = (editedSpot) => ({
    type: EDIT_SPOT,
    editedSpot
})

export const EditYourSpot = (spotId, editedSpot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method:'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedSpot)
    })
    if(response.ok){
        const editedSpot = await response.json()
        dispatch(editASpot(editedSpot))
        return editedSpot
    }
}

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
            // const copy1 = {allSpots:{}, singleSpot:{}}
            // copy1.singleSpot = action.payload
            // return copy1
            const copy1 ={...state}
            const singleSpotData = action.payload
            copy1.singleSpot = singleSpotData
            return copy1
        case CREATE_SPOT:
            const copy2 = {...state}
            const allSpotsCopy = {...state.allSpots}
            allSpotsCopy[action.newSpot.id] = action.newSpot
            copy2.allSpots = allSpotsCopy
            return copy2
        case DELETE_SPOT:
            const copy3 = {...state}
            const allSpotsCopy1 = {...state.allSpots}
            delete allSpotsCopy1[action.id]
            copy3.allSpots = allSpotsCopy1
            return copy3
        case EDIT_SPOT:
            const copy4 = {...state}
            const allSpotsCopy2 = {...state.allSpots}
            allSpotsCopy2[action.editedSpot.id] = action.editedSpot
            copy4.allSpots = allSpotsCopy2
            return copy4
        default:
            return state
    }
}

export default spotReducer
