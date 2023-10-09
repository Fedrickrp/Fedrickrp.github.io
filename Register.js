import React, { useState } from "react";
import axios from 'axios';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import './styles.css';

export default function Register() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [username, setUsername] = useState("");

  const [address, setAddress] = useState("");


  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  }
  function addedSuccessfully() {
    alert("Successfully added!");
    window.open("/login");
  }

  function usernameIsTaken() {
    alert("Username is already in use.");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/Account/addAccount/${username}/${password}/${address}`);
      if(response.data) {
        addedSuccessfully();
      } else {
        usernameIsTaken();
      }
    } catch (error) {
      console.log("Could not access endpoint.", error)
    }
  };

  return (
    <div>
      <h2 className="baseContainer">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="p-field p-grid">
          <label htmlFor="username" className="p-col-fixed" style={{ width: '120px' }}>Username:</label>
          <div className="p-col">
            <InputText id="username" value={username} onChange={handleUsernameChange} />
          </div>
        </div>
        <div className="p-field p-grid">
          <label htmlFor="password" className="p-col-fixed" style={{ width: '120px' }}>Password:</label>
          <div className="p-col">
            <Password id="password" value={password} onChange={handlePasswordChange} />
          </div>
        </div>
        <div className="p-field p-grid">
          <label htmlFor="address" className="p-col-fixed" style={{ width: '120px' }}>Address:</label>
          <div className="p-col">
            <InputText id="address" value={address} onChange={handleAddressChange} />
          </div>
        </div>
        <button className="button" style={{marginBottom: '5px', marginTop: '5px'}} type="submit">Submit</button>
        <Link to="/login">
          <Button className="button" label="Login" severity="secondary" />
        </Link>
      </form>
    </div>
  );
}

