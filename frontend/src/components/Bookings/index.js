import { useSelector, useDispatch } from 'react-redux';
import {useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import {getBookingsThunk} from '../../store/booking'
import './Bookings.css'


const UserBookings = () =>{
    const dispatch = useDispatch()

    const bookingsObj = useSelector(state => state.bookings.bookings)
    const bookings = Object.values(bookingsObj)


    useEffect(() => {
        console.log('use')
        dispatch(getBookingsThunk())
    }, [dispatch])

    return (
        <div id='bookings-container'>
            <div id='all-bookings'>
            {bookings.map(booking => (

                <div className='bookingCard'>
                    <img
                    className='image-booking'
                    // id={`image${spot.id}`}
                    src={booking.Spot.previewImage}></img>
                    <div id='topLineSpotCard'>
                        <div>{booking.Spot.city}, {booking.Spot.state}</div>
                    </div>
                    <div id='start-date-row'>
                        <div>Start Date </div>
                        <div>{booking.startDate}</div>
                    </div>
                    <div id='end-date-row'>
                        <div>End Date </div>
                        <div>{booking.endDate}</div>
                    </div>
                </div>
                ))}
            </div>

        </div>
    )
}

export default UserBookings
