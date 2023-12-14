// Importing necessary styles and dependencies
import '../styles/Login.css';
import '../styles/MeetingEditor.css';
import useNavigateToPage from './Nav2Page';
import React, { useState, useEffect } from 'react';

// Component for displaying meeting information
const MeetingInformation = ({ meeting, onEditMeeting }) => {
  return (
    // Container for meeting information, clickable to trigger editing
    <div className="meeting-container">
      <div className="meeting-info" onClick={() => onEditMeeting(meeting)}>
        {/* Displaying individual meeting details */}
        <span>
          <strong>Title:</strong> {meeting.name}
        </span>
        <span>
          <strong>Time:</strong> {meeting.time}
        </span>
        <span>
          <strong>Date:</strong> {meeting.date}
        </span>
        <span>
          <strong>Location:</strong> {meeting.location}
        </span>
      </div>
    </div>
  );
};

// Main MeetingForm component
const MeetingForm = () => {
  // State for managing meetings and form fields
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  // Custom hook for navigation
  const NavigateToPortal = useNavigateToPage("/admin/home");

  // Function to navigate back to the portal
  const handlePortal = () => {
    NavigateToPortal();
  };

  // Event handlers for form field changes
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  // Function to edit a meeting
  const handleEditMeeting = (meeting) => {
    // Set selected meeting for editing and populate form fields
    setSelectedMeeting(meeting);
    setName(meeting.name);
    setTime(meeting.time);
    setDate(meeting.date);
    setLocation(meeting.location);
    setShowEditor(true);
  };

  // Function to add a new meeting
  const handleAddMeeting = () => {
    // API call to insert new meeting data into the database
    const requestInfoAddMeeting = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, time, date, location}),
    };

    // Making a POST request to add a new meeting
    fetch('/api/addMeeting', requestInfoAddMeeting)
      .then((response) => response.json())
      .then(data => {
        // Check if meeting creation was successful
        if (data.status.includes('Meeting successfully made:')) {
          const MeetName = data.status.replace('Meeting successfully made: ', '');
          console.log('Meeting ID Created', MeetName);

          // Add the new meeting to the local state
          const newMeeting = { id: MeetName, name, time, date, location };
          setMeetings([...meetings, newMeeting]);
        }
      })
      .catch((error) => {
        console.error('Error adding meeting:', error);
      });

    // Reset the form fields and hide the editor
    setName('');
    setTime('');
    setDate('');
    setLocation('');
    setShowEditor(false);
  };

  // Function to update an existing meeting
  const handleUpdateMeeting = () => {
    // Map through meetings to update the selected meeting
    const updatedMeetings = meetings.map((meeting) => {
      if (meeting === selectedMeeting) {
        return { ...meeting, name: name, time: time, date: date, location: location };
      }
      return meeting;
    });

    // API call to update the database with the edited data
    const requestInfoEditMeeting = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, time, date, location }),
    };

    // Making a PUT request to update an existing meeting
    fetch(`/api/updateMeeting/${selectedMeeting.id}`, requestInfoEditMeeting)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Meeting updated successfully:', data);
        // Update local state and reset form fields
        setMeetings(updatedMeetings);
        setSelectedMeeting(null);
        setName('');
        setTime('');
        setDate('');
        setLocation('');
        setShowEditor(false);
      })
      .catch((error) => {
        console.error('Error updating meeting:', error);
      });
  };

  // Function to delete a meeting
  const handleDeleteMeeting = (meeting) => {
    const meetingId = meeting.id;

    // API call to delete the meeting from the database
    fetch(`/api/deleteMeeting/${meetingId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Meeting deleted successfully', data);
      })
      .catch((error) => {
        console.error('Error deleting meeting:', error);
      });

    // Remove the meeting from the local state
    const updatedMeetings = meetings.filter((m) => m.id !== meetingId);
    setMeetings(updatedMeetings);
  };

  // Function to disable the editor and reset form fields
  const disableEditor = () => {
    setShowEditor(false);
    setSelectedMeeting(null);
    setName('');
    setTime('');
    setDate('');
    setLocation('');
  };

  // Fetch meetings from the database on component mount
  useEffect(() => {
    // Request info for fetching meetings
    var requestInfoMeetingsDisplay = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    // API call to fetch meetings from the database
    fetch('/api/adminMeetings', requestInfoMeetingsDisplay)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const meetIdentifier = data.meetings;
        console.log('Fetched meetings:', meetIdentifier);
        // Update local state with fetched meetings
        setMeetings(meetIdentifier);
      })
      .catch((error) => {
        console.error('Error fetching meetings:', error);
      });
  }, []);

  // Render the component
  return (
    <div>
      <div>
        {/* Back button and heading */}
        <button type="button" onClick={handlePortal}>
          Back
        </button>
        <h1>Club Meeting Editor</h1>
      </div>

      <div>
        {/* Display existing meetings */}
        {meetings.map((meeting, index) => (
          <MeetingInformation
            key={index}
            meeting={meeting}
            onEditMeeting={handleEditMeeting}
          />
        ))}
      </div>

      {/* Display meeting editor if showEditor is true */}
      {showEditor && (
        <div>
          {/* Form fields for editing the meeting */}
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Name"
          />
          <input
            type="time"
            value={time}
            onChange={handleTimeChange}
            placeholder="Time"
          />
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            placeholder="Date"
          />
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            placeholder="Location"
          />

          {/* Buttons for different functionalities */}
          <button onClick={disableEditor}>Back</button>
          {!selectedMeeting && (
            <button onClick={handleAddMeeting}>Add Meeting</button>
          )}
          {selectedMeeting && (
            <>
              <button onClick={handleUpdateMeeting}>Update Meeting</button>
              <button onClick={() => handleDeleteMeeting(selectedMeeting)}>
                Delete Meeting
              </button>
            </>
          )}
        </div>
      )}

      {/* Button to show the meeting editor */}
      <button onClick={() => setShowEditor(true)}>Add New Meeting</button>
    </div>
  );
};

// Exporting the component
export default MeetingForm;
