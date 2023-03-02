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

    useEffect(() => {
        // console.log('use')
        dispatch(getBookingsThunk())
    }, [dispatch])


    const pastBookings = bookings.filter(booking => {
        const splitEnd = booking.endDate.split('-')
        const endYear = Number(splitEnd[0])
        const endMonth = Number(splitEnd[1])
        const endDay = Number(splitEnd[2])

        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()

        if(endYear < year) return true
        else if( endYear === year && endMonth < month) return true
        else if(endMonth === month && endDay < day) return true
        else{
            return false
        }
    })
    const futureBookings = bookings.filter(booking => {
        const splitStart = booking.startDate.split('-')

        const startYear = Number(splitStart[0])
        const startMonth = Number(splitStart[1])
        const startDay = Number(splitStart[2])

        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()

        return startYear >= year && startMonth >= month && startDay >=day
    })
    console.log('book', bookings)
    console.log('p',pastBookings)
    console.log('f', futureBookings)

    const splitDate = (date) => {
        const split = date.split('T')
        return split[0]
    }

    const handleDeletion = async(id) => {
        const response = dispatch(deleteBookingThunk(id))


        if(response){
            history.push('/trips')
            alert('Canceled Successfully!')
        }
    }


    return (
        <div id='bookings-container'>
            <div id='bookings-layout' >
            <div className='booking-filter-label'>Current/Future Bookings </div>
            <div id='all-bookings'>

            {futureBookings.map(booking => (

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
                        <div className='date-info'>{splitDate(booking.startDate)}</div>
                    </div>
                    <div id='end-date-row'>
                        <div className='date-label'>End Date </div>
                        <div className='date-info'>{splitDate(booking.endDate)}</div>
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
            <div className='booking-filter-label'>Previous Bookings </div>
            <div id='all-bookings'>
                {pastBookings.map(booking => (

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

                </div>
                ))}
                </div>
            </div>

        </div>
    )
}

export default UserBookings
