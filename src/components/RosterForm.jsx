import '../styles/Login.css';
import '../styles/MeetingEditor.css';
import useNavigateToPage from './Nav2Page';
import React, { useState, useEffect } from 'react';

const RosterInformation = ({ member, onEditMember }) => {
  return (
    <div className="meeting-container">
      <div className="meeting-info" onClick={() => onEditMember(member)}>
        <span>
          <strong>#</strong> {member.id}
        </span>
        <span>
          <strong>Name:</strong> {member.name}
        </span>
        <span>
          <strong>Username:</strong> {member.username}
        </span>
        <span>
          <strong>Year:</strong> {member.year}
        </span>
        <span>
          <strong>Role:</strong> {member.isOfficer}
        </span>
      </div>
    </div>
  );
};

const RosterForm = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showAdder, setShowAdder] = useState(false);
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [year, setYear] = useState('');
  const [role, setRole] = useState('');
  const [id, setId] = useState('');

  const NavigateToPortal = useNavigateToPage("/admin/home");

  const handlePortal = () => {
      NavigateToPortal();
  };

  const handleUsernameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.checked);
  };


  // edit the member when it submitted
  const handleEditMember = (roster) => {
    setSelectedMember(roster);
    setYear(roster.year)
    setRole(roster.isOfficer);
    setShowEditor(true);
  };

  // add the member to the database and display the new set of members
  const handleAddMember = () => {
    // make the request info for the API call
    const requestInfoAddMember = {
      method: 'POST',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify({userName} ),
    };

    // API call to insert new member data into the database
    fetch('/api/addMember', requestInfoAddMember)
      .then((response) => response.json())
      .then(data => { // use data to calculate outcome
        if(data && data.status && data.status.includes('Member successfully added:')) {
            const memberId = data.status.replace('Member successfully added: ', '');  // only the username is left
            console.log('Member ID Created', memberId);

            // Add the new member to the local state
            const newMember = { id: memberId, name: name, username: userName, year: year, isOfficer: role};
            setMembers([...members, newMember]);
          }
      })
      .catch((error) => {
        // Handle any errors that occur during the fetch request
        console.error('Error adding member:', error);
      });

    // Reset the form fields and hide the editor
    setUserName('');
    setShowAdder(false);
  };


// update the member in the database and display the new set of members
const handleUpdateMember = () => {
  const updatedMembers = members.map((m) => {
    if (m === selectedMember) {
      return { ...m, year: year, isOfficer: role };
    }
    return m;
  });

  const requestInfoEditMember = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ year, role}),
  };

  fetch(`/api/updateMember/${selectedMember.id}`, requestInfoEditMember)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Member updated successfully:', data);
      setMembers(updatedMembers);
      setSelectedMember(null);
      setYear('');
      setRole('');
      setShowEditor(false);
    })
    .catch((error) => {
      console.error('Error updating member:', error);
    });
};

// deletes the member from the database and display the new set of members
const handleDeleteMember = (member) => {
  const memberId = member.id;
  console.log('Deleting member with ID:', memberId);

  fetch(`/api/deleteMember/${memberId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Member deleted successfully', data);
      const updatedMembers = members.filter((m) => m.id !== memberId);
      setMembers(updatedMembers);
    })
    .catch((error) => {
      console.error('Error deleting member:', error);
    });
};

const disableEditor = () => {
  setShowEditor(false);
  setSelectedMember(null);
  setYear('');
  setRole('');
}

const disableAdder = () => {
  setShowAdder(false);
  setSelectedMember(null);
  setUserName('');
}

// display the members from the database
  useEffect(() => {
      var requestInfoMembersDisplay = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
}
    fetch('/api/adminRoster', requestInfoMembersDisplay)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
          const memberList = data.roster;
          console.log('Fetched members:', memberList); // Add this console log
          setMembers(memberList);
          
        })
        .catch((error) => {
            console.error('Error fetching members:', error);
        });
}, []);
// add form to the page then change add member button to submit button
  return (
    <div>
    <div>
      <button type="button" onClick={handlePortal}>
        Back
      </button>
      <h1>Club Roster Editor</h1>
    </div>

    <div>
        {members.map((member, index) => (
          <RosterInformation
            key={index}
            member={member}
            onEditMember={handleEditMember}
          />
        ))}
      </div>

      {showEditor && (
        <div>
          {/* Form fields for editing members */}
          <input
            type="text"
            value={year}
            onChange={handleYearChange}
            placeholder="Year"
          />
          <label>
            <strong>Role:</strong>
            <input
              type="checkbox"
              checked={role}
              onChange={handleRoleChange}
            />
          </label>

          {/* Buttons to go back, update, and delete */}
          <button onClick={disableEditor}>Back</button>
          {selectedMember && (
            <>
              <button onClick={handleUpdateMember}>Update Member</button>
              <button onClick={() => handleDeleteMember(selectedMember)}>Delete Member</button>
            </>
          )}
        </div>
      )}

      {showAdder && (
        <div>
          {/* Form fields for adding a new member */}
          <input
            type="text"
            value={userName}
            onChange={handleUsernameChange}
            placeholder="Username"
          />

          {/* Buttons to go back and add */}
          <button onClick={disableAdder}>Back</button>
          <button onClick={handleAddMember}>Add Member</button>
        </div>
      )}

      {/* Button to show the adder form */}
      <button onClick={() => setShowAdder(true)}>Add New Member</button>
    </div>
  );
};

export default RosterForm;
