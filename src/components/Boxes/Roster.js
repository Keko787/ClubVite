import React, { useState } from 'react';

function RosterList() {
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState('');

  const handleAddMember = (e) => {
    e.preventDefault();

    if (memberName.trim() !== '') {
      setMembers([...members, memberName]);
      setMemberName('');
    }
  };

  const handleRemoveMember = (index) => {
    const updatedMembers = [...members];
    updatedMembers.splice(index, 1);
    setMembers(updatedMembers);
  };

  return (
    <div>
      <h1>Roster List</h1>

      <form onSubmit={handleAddMember}>
        <input
          type="text"
          placeholder="Enter member's name"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
          required
        />
        <button type="submit">Add Member</button>
      </form>

      <ul>
        {members.map((member, index) => (
          <li key={index}>
            {member}
            <button onClick={() => handleRemoveMember(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RosterList;