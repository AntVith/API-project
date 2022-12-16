import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {getAllSpots} from '../../store/spots'
import { useParams } from 'react-router-dom';
import {EditYourSpot} from '../../store/spots'
import './editSpot.css'

function EditSpot() {
    const {spotId} = useParams()

    const spots = useSelector(state =>{
        return state.spots.allSpots
    })

    const spotToEdit = spots[spotId]

    const [address, setAddress] = useState(spotToEdit.address)
    const [city, setCity] = useState(spotToEdit.city)
    const [state, setState] = useState(spotToEdit.state)
    const [country, setCountry] = useState(spotToEdit.country)
    const [name, setName] = useState(spotToEdit.name)
    const [description, setDescription] = useState(spotToEdit.description)
    const [price, setPrice] = useState(spotToEdit.price)
    const [validationErrors, setValidationErrors] = useState([])

    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        // checking for errors in input
        let errors = []
        if(!address) errors.push('invalid address')
        if(!city) errors.push('invalid city')
        if(!state) errors.push('invalid state')
        if(!country) errors.push('invalid country')
        if(!name) errors.push('invalid name')
        if(!description) errors.push('invalid description')
        if(!price || price < 1) errors.push('Price needs to be more than $0')
        if(!Number(price)) errors.push('Price needs to be a number')
        setValidationErrors(errors)
    }, [address, city, state, country, name, description, price])

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])




   const handleSubmit = async (e) => {
       e.preventDefault()

       const editedSpot = {
           address,
           city,
           state,
           country,
           lat: 100,
           lng: 100,
           name,
           description,
           price
       }

       const response = await dispatch(EditYourSpot(spotId, editedSpot))
       console.log('res', response)
       if(response){
           history.push(`/spots/${response.id}`)
       }
   }
   // prevents errors during refresh if spot to edit hasn't loaded in yet
if(!spotToEdit) return null

    return (
        <div className='pageDiv'>
        <div id='formDiv'>
        <text
        id='editTitle'
        > Edit your spot below!</text>
        <ul className='errors'>
            {validationErrors.map(error => (
                <li key={error}>
                {error}
                </li>
            ))}
        </ul>
        <form
        id='createForm'
        onSubmit={handleSubmit}>
        <label>
            {/* Address: */}
            <input
            type='text'
            className='inputArea'
            onChange={(e) => setAddress(e.target.value)}
            value={address}
            // placeholder={spotToEdit.address}
            name='address'
            />
        </label>
         <label>
            {/* City: */}
            <input
            type='text'
            className='inputArea'
            onChange={(e) => setCity(e.target.value)}
            value={city}
            // placeholder={spotToEdit.city}
            name='city'
            />
        </label>
         <label>
            {/* State: */}
            <input
            type='text'
            className='inputArea'
            onChange={(e) => setState(e.target.value)}
            value={state}
            // placeholder={spotToEdit.state}
            name='state'
            />
        </label>
        <label>
            {/* Country: */}
            <input
            type='text'
            className='inputArea'
            onChange={(e) => setCountry(e.target.value)}
            value={country}
            // placeholder={spotToEdit.country}
            name='country'
            />
        </label>
        <label>
            {/* Name: */}
            <input
            type='text'
            className='inputArea'
            onChange={(e) => setName(e.target.value)}
            value={name}
            // placeholder={spotToEdit.name}
            name='country'
            />
        </label>
         <label>
            {/* Description: */}
            <input
            type='text'
            className='inputArea'
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            // placeholder={spotToEdit.description}
            name='description'
            />
        </label>
         <label>
            {/* Price: */}
            <input
            type='integer'
            className='inputArea'
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            // placeholder={spotToEdit.price}
            name='price'
            />
        </label>
            <label>
            <button
             type='submit'
             id='submitButton'
             disabled={validationErrors.length > 0}
             >Submit</button>
        </label>
        </form>
    </div>
    </div>
    )

}


export default EditSpot
