import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {useEffect} from 'react'
import { getSpotById } from '../../store/spots';


const SpotDetail = () =>{

const {spotId} = useParams()
console.log('id',  spotId)
const dispatch = useDispatch()

const spot = useSelector(state => {
    return state.spots.singleSpot
})
console.log('spot', spot)

useEffect(() => {
    dispatch(getSpotById(spotId))
}, [dispatch, spotId])
console.log('images', spot.SpotImages)
console.log('owner', spot.Owner)

    return (
        <div id={spot.id}>
            {spot.name}
            <div>{spot.avgStarRating} star rating</div>
            <div>{spot.numReviews} reviews</div>
            <div>{spot.city}, {spot.state}, {spot.country}</div>
            {/* <div>{spot.SpotImages.map(image => (
                <div key={image.url}>{image.url} </div>
            ))}
            </div> */}
            {/* <div>Beautiful spot hosted by {spot.Owner.firstName}</div> */}
            <div>{spot.description}</div>
        </div>
    )
}

export default SpotDetail
