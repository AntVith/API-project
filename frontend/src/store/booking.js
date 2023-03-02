import { csrfFetch } from "./csrf";


const GET_BOOKINGS = 'bookings/GET_BOOKINGS'

const userBookings = (trips) => ({
    type: GET_BOOKINGS,
    trips
})

export const getBookingsThunk = () => async (dispatch) => {
    console.log('thunk')
    const response = await csrfFetch('/api/bookings/current')

    if(response.ok){
        const trips = await response.json()
        console.log('trps', trips)
        dispatch(userBookings(trips))
    }
}

const initialState = {bookings: {}}
const bookingReducer = (state = initialState, action ) => {
    switch(action.type){
        case GET_BOOKINGS:{
            const newState = {...state}
            const newBookings = {...state.bookings}
            action.trips.Bookings.forEach(booking => newBookings[booking.id] = booking)
            newState.bookings = newBookings
            return newState
        }

        default:
            return state
    }
}

export default bookingReducer
