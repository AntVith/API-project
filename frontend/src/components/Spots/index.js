import {useDispatch, useSelector} from 'react-redux'
import {useEffect} from 'react'
import {getAllSpots} from '../../store/spots'
import { NavLink } from 'react-router-dom'
import './Spots.css'
const HomePage = () => {

const dispatch = useDispatch()

const spots = useSelector(state => {
    return state.spots.allSpots
})
const spotsInfo = Object.values(spots)

useEffect(() => {
    dispatch(getAllSpots())
}, [dispatch])

    return (
        <div id='homePage'>
    <div id='allSpots'>
        {spotsInfo.map(spot => (

            <NavLink
            to={`/spots/${spot.id}`}
            id={spot.address}
            key={spot.id}
            style={{ textDecoration: 'none' }}>
                <img
                className='image'
                // id={`image${spot.id}`}
                src={spot.previewImage}></img>
                <div id='topLineSpotCard'>
                    <div>{spot.city}, {spot.state}</div>
                    <div id='rating'>
                    <i
                    id='star'
                    className="fa-solid fa-star"></i>
                    <div id='avgRating'>{spot.avgRating}</div>
                    </div>
                </div>
                <div
                id='price'
                >${spot.price} night </div>
            </NavLink>
        ))}
    </div>
    </div>
    )
}



export default HomePage
