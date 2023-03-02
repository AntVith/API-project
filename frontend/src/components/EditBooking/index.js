import { NavLink, useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {useEffect, useState} from 'react'
import {getBookingsThunk, editBookingThunk} from '../../store/booking'
import './EditBooking.css'

function EditBooking(){

    const {bookingId} = useParams()
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        console.log('use')
        dispatch(getBookingsThunk())
    }, [dispatch])

    const bookings = useSelector(state => state.bookings.bookings)
    const bookingToEdit = bookings[bookingId]



    const [startDate, setStartDate] = useState(bookingToEdit.startDate)
    const [endDate, setEndDate] = useState(bookingToEdit.endDate)
    const [errors, setErrors] = useState([])

    if(!bookingToEdit) return null


    const handleSubmit = async (e) => {
        e.preventDefault()
        const bookingData = {
            startDate,
            endDate
        }
        console.log('data', bookingData)

        const editedBooking = await dispatch(editBookingThunk(bookingId, bookingData)).catch(
            async (res) => {
              const data = await res.json()
              if(data && data.errors) setErrors(Object.values(data.errors))
            }
        )
        // console.log('res', postBooking)

        if(editedBooking){
            setTimeout(() => window.location.reload(true), 1);
            history.push('/trips')
            // window.location.reload(true)

            // dispatch(getBookingsThunk())
        }
    }
    console.log('errors', errors)
    return (
        <div id='edit-booking-container'>
        <div id='bookings-edit-side'>
                <div id='booking-edit-post'>

                <form  onSubmit={handleSubmit} method="post" id='booking-form'>
                <div id='title-booking-edit'>We will notify the owner of your new dates!</div>
                    {/* <div id='pricePerNight'>${spot.price} night</div> */}

                    <div id='edit-booking-errors'>
                        {errors.map((error, idx) => (
                            <div key={idx}>{error}</div>
                        ))}
                    </div>
                    <div>CHECK-IN</div>
                     <input
                     type='date'
                     required
                     onChange={(e) => setStartDate(e.target.value)}
                     value={startDate}
                     className='date-inputs'
                     />

                     <div> CHECK-OUT</div>
                     <input
                     required
                     type='date'
                     onChange={(e) => setEndDate(e.target.value)}
                     value={endDate}
                     className='date-inputs'
                     />
                    <button type='submit' id='booking-submit-button'> Reserve</button>

                </form>

                </div>
            </div>
            </div>
    )

}

export default EditBooking
