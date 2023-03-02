import { useSelector, useDispatch } from 'react-redux';
import {useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import {getBookingsThunk, deleteBookingThunk} from '../../store/booking'
import './Bookings.css'


const UserBookings = () =>{
    const dispatch = useDispatch()
    const history = useHistory()

    const bookingsObj = useSelector(state => state.bookings.bookings)
    const bookings = Object.values(bookingsObj)


    useEffect(() => {
        console.log('use')
        dispatch(getBookingsThunk())
    }, [dispatch])

    const handleDeletion = async(id) => {
        const response = dispatch(deleteBookingThunk(id))


        if(response){
            history.push('/trips')
            alert('Canceled Successfully!')
        }
    }

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
                    <button onClick={() => handleDeletion(booking.id)}>Cancel Reservation</button>
                </div>
                ))}
            </div>

        </div>
    )
}

export default UserBookings
