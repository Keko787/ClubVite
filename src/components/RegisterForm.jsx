import '../styles/Login.css';
import { useState } from "react";
import useNavigateToPage from '../components/Nav2Page';

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const NavigateToLogin = useNavigateToPage('/');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePinChange = (event) => {
    setPin(event.target.value);
  };

  const handlePinConfirmChange = (event) => {
    setPinConfirm(event.target.value);
  };

  const handleLogin = () => {
    NavigateToLogin();
  };

  const handleSubmit = (event) => {
  
    event.preventDefault(); // ? 
  
    // initialize the variable from the value of the input username and pin
    var name = document.getElementById('_name').value;
    var username = document.getElementById('_username').value;
    var pin = document.getElementById('_pin').value;
    var pinConfirm = document.getElementById('_pinConfirm').value;

    // if theres a match
    if(pin === pinConfirm) {

        // initialize the request info
        var requestInfo = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, pin, name})
        }
    
        const data = fetch('/api/register', requestInfo)  // send the input to the url and get the response back
            .then (response => response.json()) // it got the response from the post request. returns the response into dat
            .then(data => { // use data to calculate outcome
                if(data.status.includes('Registration successful for username:')) {
                    const userName = data.status.replace('Registration successful for username: ', '');  // only the username is left
                    console.log('User name', userName);
                    console.log('made it phew');
                    NavigateToLogin();
                  }
            })
            .catch(error => {
                console.error('trouble:',error);
                //console.log(response);
            })
            
    }
    // if there isnt a match
    else
    {
    alert('WRONG!!!');
    }
  
    }

  return (
    <div className='container'>
      <form className='login_box'>
        <h1>Register</h1>
        <span className='input_row'>
          <label>Name: </label>
          <input type="text" id="_name" value={name} onChange={handleNameChange} />
        </span>
        <span className='input_row'>
          <label>Username: </label>
          <input type="text" id="_username" value={username} onChange={handleUsernameChange} />
        </span>
        <span className='input_row'>
          <label>Password: </label>
          <input type="password" id="_pin" value={pin} onChange={handlePinChange} />
        </span>
        <span className='input_row'>
          <label>Confirm Password: </label>
          <input type="password" id="_pinConfirm" value={pinConfirm} onChange={handlePinConfirmChange} />
        </span>
        <div className='button_container'>
          <button
            className='submit'
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className='submit'
            type="submit"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
  };
  
  export default RegisterForm;