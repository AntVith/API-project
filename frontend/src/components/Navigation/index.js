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
        exact to="/">SquareBnb</NavLink>
      </div>
      <div id='RightSide'>
      <NavLink
      id='Edit'
      style={{ textDecoration: 'none' }}
      exact to='/spots/edit'
      onClick={disableNavLinks}
      >Edit your Spots</NavLink>
      <NavLink
      id='Hosting'
      style={{ textDecoration: 'none' }}
      exact to='/spots'
      onClick={disableNavLinks}
      >Switch to Hosting</NavLink>
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
