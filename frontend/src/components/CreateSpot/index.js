import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {CreateNewSpot} from '../../store/spots'
import './createSpot.css'



function CreateSpot() {

    // i need to get owner id from session user id somehow
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    // const [lat, setLat] = useState(0)
    // const [lng, setLng] = useState(0)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [spotImage, setSpotImage] = useState('')
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
         if(!spotImage) errors.push('invalid image')

         setValidationErrors(errors)

    }, [address, city, state, country, name, description, price, spotImage])

    const handleSubmit = async (e) => {
        e.preventDefault()

        // // checking for errors in input
        // let errors = []
        // if(!address) errors.push('invalid address')
        // if(!city) errors.push('invalid city')
        // if(!state) errors.push('invalid state')
        // if(!country) errors.push('invalid country')
        // if(!name) errors.push('invalid name')
        // if(!description) errors.push('invalid description')
        // if(!price || price < 1) errors.push('invalid price')
        // if(!spotImage) errors.push('invalid image')

        // setValidationErrors(errors)
        // if(validationErrors.length){
        //     return
        // }
        // if it makes it past errors, create the data format with data from form to send to DB
        const newSpot = {
            // owner id or does it autmatically get it from session user
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
        const newSpotImage = {
            url: spotImage,
            preview: true
        }

        const response = await dispatch(CreateNewSpot(newSpot, newSpotImage))
        console.log('res', response)
        if(response){
            history.push(`/spots/${response.id}`)
        }
    }


return (
    <div className='pageDiv'>
    <div id='formDiv'>

        <text
        id='title'
        > SquareBnb it, let's get this bread!</text>
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
            placeholder='Address'
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
            placeholder='City'
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
            placeholder='State'
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
            placeholder='Country'
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
            placeholder='Name'
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
            placeholder='Description'
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
            placeholder='Price'
            name='price'
            />
        </label>
         <label>
            {/* The Image-URL for your Spot: */}
            <input
            type='text'
            className='inputArea'
            onChange={(e) => setSpotImage(e.target.value)}
            value={spotImage}
            placeholder='Image-URL for your Spot'
            name='spotImage'
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

export default CreateSpot
