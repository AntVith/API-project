import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  const demoUserLogin = () =>{
    setCredential('Demo-lition')
    setPassword('password')
    document.getElementById('logInButton').click()
  }

  return (

    <div id='logInFull'>
      <h1 id='logInTitle'>Log In</h1>
      <form id= 'logInForm' onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          {/* Username or Email */}
          <input
            id='usernameOrEmailField'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder='Username or Email'
          />
        </label>
        <label>
          {/* Password */}
          <input
            id='passwordField'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password'
          />
        </label>
        <button id='logInButton' type="submit">Log In</button>
        <button id='DemoUserButton' onClick={demoUserLogin} >Demo User</button>
      </form>
      </div>

  );
}

export default LoginFormModal;
