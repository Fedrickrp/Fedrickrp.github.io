import React, { useState } from "react";
import axios from 'axios';
import Register from './Register';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './styles.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const toOverview = (username) => {
    navigate("/Overview", { state : {
      user: username}} )
  }

  function invalidPassword() {
    alert("Incorrect password or username");
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8080/Account/verifyPassword/${username}/${password}`);
      const isPasswordValid = response.data;

      if (isPasswordValid) {
        toOverview(username);

      } else {
        invalidPassword();
      }

    } catch (error) {
      console.log("Could not access endpoint.", error)
    }
  };


  return (
    <div>
      <h2 className="baseContainer">Log-in</h2>
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
            <Password id="password" feedback={false} value={password} onChange={handlePasswordChange} />
          </div>
        </div>
        <button type="submit" style={{ marginBottom: '5px', marginTop: '5px'}}>Submit</button>
        <Link to="/register">
          <Button label="Register" severity="secondary"/>
        </Link>
      </form>
      <div>
        
      </div>
    </div>
  );
}