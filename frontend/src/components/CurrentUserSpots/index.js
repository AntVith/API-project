import { useSelector, useDispatch } from 'react-redux';
import {useEffect} from 'react'
import { getAllSpots, DeleteOneSpot } from '../../store/spots';
import { useHistory } from 'react-router-dom';
import './currentUserSpots.css'

const CurrentUserSpots = () =>{

const currentUser = useSelector(state =>{
   return state.session.user
})

const spotsObject = useSelector(state => {
    return state.spots.allSpots
})

const spots = Object.values(spotsObject)
const userSpots = spots.filter(spot => spot.ownerId === currentUser.id)

const dispatch = useDispatch()
useEffect(() => {
    dispatch(getAllSpots())
}, [dispatch])

const history = useHistory()
const editSpot = async (id) =>{
    history.push(`/spots/${id}/edit`)
}

let message;
const DeleteSpot = async (id) =>{
    const response = await dispatch(DeleteOneSpot(id))
    console.log('res', response)
    if(response){
        message = response.message
    }
}
console.log('message', message)
    return (
        <div className ='wholePage'>
        {/* <div>{message !== 'undefined' &&
        <h3>{message}</h3>
        }</div> */}
        <div className='allUserSpots'>
             {userSpots.map(spot => (
                <div
                key={spot.id}
                >
                <img
                className='image'
                src={spot.previewImage}></img>
                <div className='infoWithEditORdelete'>
                <div id='topLineSpotCard'>
                    <div>{spot.city}, {spot.state}</div>
                    {/* <div>
                    <i className="fa-solid fa-star"></i>
                        {spot.avgRating}</div> */}
                </div>
                <div className='editORdelete'>
                <button
                id='EditButton'
                onClick={() => editSpot(spot.id)}
                >Edit</button>
                <button
                id='DeleteButton'
                onClick={() => DeleteSpot(spot.id)}
                >Delete</button>
                </div>
                </div>
                <div>${spot.price} night </div>
                </div>
             ))}
        </div>
        </div>
    )
}

export default CurrentUserSpots
