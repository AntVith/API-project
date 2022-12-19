import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  const disableNavLinks = (e) => {
    if(!sessionUser) e.preventDefault()
  }
  return (
    <div id='NavBar'>
      <div id='HomeButton'>
        <NavLink
        id='HomeButtonNavLink'
        style={{ textDecoration: 'none' }}
        exact to="/">SquareBnB</NavLink>
      </div>
      <div id='RightSide'>

      {sessionUser &&
      <NavLink
      id='Hosting'
      style={{ textDecoration: 'none' }}
      exact to='/spots'
      onClick={disableNavLinks}
      >Squarebnb your home</NavLink>}
      {isLoaded && (
        <div id='ProfileButton'>
          <ProfileButton user={sessionUser} />
        </div>
      )}
      </div>
    </div>
  );
}

export default Navigation;
