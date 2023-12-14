import '../styles/Login.css';
import useNavigateToPage from './Nav2Page';
import { useState, useEffect } from 'react';



const AdminOptions = () => {
    const [club, setClub] = useState();

    const NavigateToLogin = useNavigateToPage('/admin/login');
    const NavigateToRosterEditor = useNavigateToPage('/admin/rosterEditor');
    const NavigateToMeetingEditor = useNavigateToPage('/admin/meetingEditor');
    
    const handleLogin = () => {
        NavigateToLogin();
    };

    const handleMeetingEditor = () => {
      NavigateToMeetingEditor();
  };

    const handleRosterEditor = () => {
    NavigateToRosterEditor();
};

    var requestInfo = {
      method: 'POST',
      headers: {'Content-Type': 'application/json',},
    }

    useEffect(() => {
        // Make an API call to fetch the club names associated with the user
        fetch('/api/adminClub', requestInfo)
          .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            // Extract the club names from the data response
            const clubName = data.club.map(club => club.name);
            // Update the 'clubs' state with the fetched club names
            console.log(clubName);
            setClub(clubName);
          })
          .catch((error) => {
                  console.error('Error fetching admin club:', error);
          });
    },
    []);
  
  return (
      <div >
        <button
        type="button"
        onClick={handleLogin}
        >
        Back
        </button>
        <h1>{club}</h1>
        <h1>Admin Home</h1>
      <button
        type="button"
        onClick={handleRosterEditor} // Change to onSubmit when done testing
      >
        Roster Editor
      </button>
      <button
        type="button"
        onClick={handleMeetingEditor}
      >
        Meeting Editor
      </button>
    </div>
    );
  };
  
  export default AdminOptions;