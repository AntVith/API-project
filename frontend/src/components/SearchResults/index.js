import {useDispatch, useSelector} from 'react-redux'
import {useEffect} from 'react'
import {getAllSpots} from '../../store/spots'
import { NavLink, useParams } from 'react-router-dom'
import '../Spots/Spots.css'



function SearchResults(){

    const dispatch = useDispatch()

    const searchWordObject = useParams()
    console.log('w', searchWordObject)

    const searchWord = searchWordObject.keyword.toLowerCase()
    console.log('s', searchWord)

    const spots = useSelector(state => {
    return state.spots.allSpots
    })
    const spotsInfo = Object.values(spots)

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    const filtered = spotsInfo.filter(spot => {
        const address = spot.address.toLowerCase()
        const city = spot.city.toLowerCase()
        const state = spot.state.toLowerCase()
        const description = spot.description.toLowerCase()
        const name = spot.name.toLowerCase()
        return address.includes(searchWord)|| city.includes(searchWord) || state.includes(searchWord) || description.includes(searchWord) || name.includes(searchWord)
    })

    function hasSearchResults(){
        if(filtered.length){
            return <div id='homePage'>
            <div id='allSpots'>
            {filtered.map(spot => (

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
        } else{
            return <div id='no-results'>
                <div id='nothing-found-text'>Nothing was found :( </div>
                <div id='recommendation'>Try searching for the city, state, or # of beds you need!</div>
                </div>
        }
    }


    return (
        <div>{hasSearchResults()}</div>
    )


}
export default SearchResults
