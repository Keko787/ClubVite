import '../styles/Login.css';
import { useState } from "react";
import useNavigateToPage from'./Nav2Page';


const AdminLoginForm = () => {
  

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const NavigateToHome = useNavigateToPage("/home");
const NavigateToPortal = useNavigateToPage("/admin/home");  // not sure if url slug is correct

const handleUsernameChange = (event) => {
  setUsername(event.target.value);
};

const handlePasswordChange = (event) => {
  setPassword(event.target.value);
};

const handleHome = () => {
  NavigateToHome();
};


const handleSubmit = (event) => {
  
  event.preventDefault(); // ? 

  // initialize the variable from the value of the input username and pin
  var username = document.getElementById('_username').value;
  var password = document.getElementById('_password').value;


  // initialize the request info
  var requestInfo = {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
  }

  const data = fetch('/api/adminLogin', requestInfo)  // send the input to the url and get the response back
        .then (response => response.json()) // it got the response from the post request. returns the response into dat
        .then(data => { // use data to calculate outcome
            
            console.log(data);
            // if there is a match with the user and input
            if(data.message.includes('Login successful for A_ID:')) {
              const adminId = data.message.replace('Login successful for A_ID: ', '');
              console.log('Admin Id:', adminId);
              NavigateToPortal();
            }

            // if there isnt a match
            else if (data.message === 'no admin')
            {
              alert('WRONG!!!');
            }
        })
        .catch(error => {
            console.error('trouble:',error);
            //console.log(response);
        })
  }

  return (
    <div className='container'>
      <form className='login_box'>
        <h1>Admin Login</h1>
        <span className='input_row'>
          <label>Username: </label>
          <input type="text" id="_username" value={username} onChange={handleUsernameChange} />
        </span>
        <span className='input_row'>
          <label>Password: </label>
          <input type="password" id="_password" value={password} onChange={handlePasswordChange} />
        </span>
        <div className='button_container'>
          <button
            className='submit'
            type="submit"
            onClick={handleSubmit} // Change to onSubmit when done testing
          >
            Submit
          </button>
          <button
            className='submit'
            type="button"
            onClick={handleHome}
          >
            Home
          </button>
        </div>
      </form>
    </div>
  );
  };
  
  export default AdminLoginForm;