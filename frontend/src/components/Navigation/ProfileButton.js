import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { NavLink } from 'react-router-dom';
import './ProfileButton.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const sessionUser = useSelector(state => state.session.user);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };
  const disableNavLinks = (e) => {
    if(!sessionUser) e.preventDefault()
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
    <div id='ProfileDropdown'>
      <button id='ProfileButton' onClick={openMenu}>
      <i id='bars' className="fa-solid fa-bars"></i>
        <i className="fa-regular fa-circle-user fa-xl" />
      </button>
      <ul  className={ulClassName} ref={ulRef}>
        {user ? (
          <>
          <div id='ProfileList'>
            <div id='username'>{user.username}</div>
            <div id='governmentName'>{user.firstName} {user.lastName}</div>
            <div id='email'>{user.email}</div>
            <div id='mySpots' >
              {sessionUser &&
                <NavLink
                id='userSpots'
                style={{ textDecoration: 'none' }}
                exact to='/spots/edit'
                onClick={disableNavLinks}
                >My Spots</NavLink>
              }
            </div>
              <div id='userReviews'>
              {sessionUser &&
                <NavLink
                id='reviewNavLink'
                style={{ textDecoration: 'none' }}
                to='/reviews'
                >My Reviews</NavLink>
              }
              </div>
              <button id='logOutButton' onClick={logout}>Log Out</button>

          </div>
          </>
        ) : (
          <div id='unSignedIn'>
            <div id='LogIn'>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            </div>
            <div id="SignUp">
            <OpenModalMenuItem
              itemText="Sign Up"
              id='Sign-up'
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
            </div>
          </div>
        )}
      </ul>
      </div>
    </>
  );
}

export default ProfileButton;
