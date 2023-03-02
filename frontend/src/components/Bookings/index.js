import { useSelector, useDispatch } from 'react-redux';
import {useEffect} from 'react'
import { useHistory, NavLink } from 'react-router-dom'
import {getBookingsThunk, deleteBookingThunk} from '../../store/booking'
import './Bookings.css'
import { useState } from 'react';


const UserBookings = () =>{
    const dispatch = useDispatch()
    const history = useHistory()

    const bookingsObj = useSelector(state => state.bookings.bookings)
    const bookings = Object.values(bookingsObj)
    console.log('book', bookings)
    let starts = []

    let ends = []


    useEffect(() => {
        // console.log('use')
        dispatch(getBookingsThunk())
    }, [dispatch])
    const handleDeletion = async(id) => {
        const response = dispatch(deleteBookingThunk(id))


        if(response){
            history.push('/trips')
            alert('Canceled Successfully!')
        }
    }
    // if(bookings.length){
    //     const startsData = []
    //      bookings.forEach(booking => {
    //         starts.push(booking.startDate)
    //     })
    //     // if(starts != startsData) setStarts(startsData)
    //     const endsData = []
    //      bookings.forEach(booking => {
    //         ends.push(booking.startDate)
    //     })
    //     // if(ends != endsData)setEnds(endsData)
    // }


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
                        <div className='date-label'>Start Date </div>
                        <div className='date-info'>{booking.startDate}</div>
                    </div>
                    <div id='end-date-row'>
                        <div className='date-label'>End Date </div>
                        <div className='date-info'>{booking.endDate}</div>
                    </div>
                    <div id='edit-booking-section'>
                        <NavLink
                        to={`/trips/${booking.id}/edit`}
                        style={{ textDecoration: 'none' }}
                        id='edit-booking-link'
                        >
                        <div>Edit Booking</div>
                        </NavLink>
                    </div>
                    <button onClick={() => handleDeletion(booking.id)} id='cancel-booking-button'>Cancel Reservation</button>
                </div>
                ))}
            </div>

        </div>
    )
}

export default UserBookings
