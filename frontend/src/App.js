import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from './components/Spots'
import {Route} from 'react-router-dom'
import SpotDetail from './components/SpotDetails'
import CreateSpot from "./components/CreateSpot";
import CurrentUserSpots from "./components/CurrentUserSpots";
import EditSpot from "./components/EditSpot";
import UserReviews from "./components/UserReviews";
import CreateReview from "./components/CreateReview";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>

          <Route
          exact
          path='/'>
            <HomePage />
          </Route>

          <Route
          exact
          path='/reviews'>
            <UserReviews />
          </Route>

          <Route
          exact
          path='/reviews/:spotId/new'>
            <CreateReview />
          </Route>

          <Route
          exact
          path='/spots'>
            <CreateSpot />
          </Route>

          <Route
          exact
          path='/spots/edit'>
            <CurrentUserSpots />
          </Route>

          <Route
          exact
          path='/spots/:spotId/edit'>
            <EditSpot />
          </Route>

          <Route
          exact
          path='/spots/:spotId'>
            <SpotDetail />
          </Route>

        </Switch>
      )}
    </>
  );
}

export default App;
