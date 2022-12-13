
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



export const getSpotById = (id) => async(dispatch) =>{
    const response = await fetch(`/api/spots/${id}`)
    console.log('spot action creator working')

    if(response.ok){
        const spot = await response.json()
        dispatch(loadOneSpot(spot))
    }
}

export const getAllSpots = () => async(dispatch) =>{
    const response = await fetch('/api/spots')
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
        default:
            return state
    }
}

export default spotReducer
