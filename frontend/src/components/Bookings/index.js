import { useSelector, useDispatch } from 'react-redux';
import {useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import {getBookingsThunk} from '../../store/booking'


const UserBookings = () =>{
    const dispatch = useDispatch()

    // const currentUser = useSelector(state => state.session.user)
    // const spotsObject = useSelector(state => state.spots.allSpots)
    const bookingsObj = useSelector(state => state.bookings.bookings)
    const bookings = Object.values(bookingsObj)
    const spotsOfBookings = []
    bookings.forEach(booking => {
        spotsOfBookings.push(booking.Spot)
    })


    console.log('book', bookingsObj)
    console.log('booking', bookings)
    console.log(spotsOfBookings)

    useEffect(() => {
        console.log('use')
        dispatch(getBookingsThunk())
    }, [dispatch])

    return (
        <div id='bookings-container'>
            <div id='all-bookings'>
            {bookings.map(booking => (

                <NavLink
                to={`/spots/${booking.Spot.id}`}
                id={booking.Spot.address}
                key={booking.Spot.id}
                style={{ textDecoration: 'none' }}>
                    <img
                    className='image'
                    // id={`image${spot.id}`}
                    src={booking.Spot.previewImage}></img>
                    <div id='topLineSpotCard'>
                        <div>{booking.Spot.city}, {booking.Spot.state}</div>
                    </div>
                    <div
                    id='price'
                    >${booking.Spot.price} night </div>
                    <div>{booking.startDate}</div>
                    <div>{booking.endDate}</div>
                </NavLink>
                ))}
            </div>

        </div>
    )
}

export default UserBookings
