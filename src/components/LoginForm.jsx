import '../styles/Login.css';
import { useState } from "react";
import useNavigateToPage from'./Nav2Page';


const LoginForm = () => {
  

const [username, setUsername] = useState("");
const [pin, setPin] = useState("");
const [error, setError] = useState(null); // New state for error message
const NavigateToHome = useNavigateToPage('/home');
const NavigateToRegst = useNavigateToPage('/register');

const handleUsernameChange = (event) => {
  setUsername(event.target.value);
};

const handlePasswordChange = (event) => {
  setPin(event.target.value);
};

const handleRegister = () => {
  NavigateToRegst();
}

const handleSubmit = (event) => {
  
  event.preventDefault(); // ? 

  // initialize the variable from the value of the input username and pin
  var username = document.getElementById('_username').value;
  var pin = document.getElementById('_pin').value;


  // initialize the request info
  var requestInfo = {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, pin})
  }

  const data = fetch('/api/login', requestInfo)  // send the input to the url and get the response back
        .then (response => response.json()) // it got the response from the post request. returns the response into dat
        .then(data => { // use data to calculate outcome
            
            console.log(data);
            // if there is a match with the user and input
            if(data.message.includes('Login successful for U_ID:')) {
              const userId = data.message.replace('Login successful for U_ID: ', '');
              console.log('User Id:', userId);
              console.log('made it phew');
              NavigateToHome();
            }

            // if there isnt a match
            else if (data.message === 'no user')
            {
              setError('Incorrect username or password'); // Set error message
            }
            else
            {
              setError('Incorrect username or password'); // Set error message
            }
        })
        .catch(error => {
            console.error('trouble:',error);
            setError('An error occurred during login'); // Set error message
          })
  }

  return (
  <div className='container'>    {/* Container for the login form */}
    <form className='login_box'>   {/* Form for user login */}
      <h1>Login</h1>  {/* Heading indicating login */}
      <span className='input_row'>   {/* Container for a row of input */}
        <label>Username: </label>   {/* Label for the username input */}
        <input type="text" id="_username" value={username} onChange={handleUsernameChange} />   {/* Input field for the username */}
      </span>
      <span className='input_row'>  {/* Container for another row of input */}
        <label>Password: </label>   {/* Label for the password input */}
        <input type="password" id="_pin" value={pin} onChange={handlePasswordChange} />  {/* Input field for the password */}
      </span>
      <div className='button_container'> {/* Container for buttons */}
        <button  // Submit button for form
          className='submit'  // Styling class for the button
          type="submit"   // Type of the button is submit
          onClick={handleSubmit} // Event handler for the submit button (change to onSubmit when done testing)
        >
          Submit
        </button>
        <button
          className='submit'  // Styling class for the button
          type="button"  // Type of the button is button
          onClick={handleRegister}   // Event handler for the register button
        >
          Register
        </button>  {/* Closing tag for the register button */}
      </div>
      {error && <div className="error-message">{error}</div>} {/* Display error message if there is an error */}
    </form> {/* Closing tag for the login form */}
  </div>

  );
  };
  
  export default LoginForm;