import { useState, useEffect } from 'react';
import useNavigateToPage from './Nav2Page';

const MeetingList = ({ meeting, roster}) => {
    const [isAttended, setIsAttended] = useState(false);
    const [isAttendedInstance, setIsAttendedInstance] = useState(false);
    const [attendanceTable, setAttendanceTable] = useState([]);
    
    var rosterProp = roster[0];

    console.log('Meeting:', meeting); // Add this console log
    console.log('Roster:', rosterProp); // Add this console log
    if(rosterProp !== undefined)
    {
        console.log('Roster id:', rosterProp.id); // Add this console log
        var rosterPropId = rosterProp.id;
    }
    else
    {
        console.log('Unable to get roster id'); // Add this console log
    }

    // grab the user's roster information
    

    useEffect(() => {
        var meetingId = meeting.id;
        var rosterId = rosterPropId;
        // Fetch the initial attendance data for the meeting
        console.log('Fetching initial attendance for meeting:', meetingId, rosterId); // Add this console log
        fetch(`/api/attendanceRosterForMeeting/${meetingId}`, {  // Use an appropriate endpoint for fetching attendance for a specific meeting
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
            console.log('Fetched initial attendance list:', data.attendances); // Add this console log
            // Set the initial attendance table with fetched data
            setAttendanceTable(data.attendances);
        })
        .catch(error => {
            console.error('Error fetching initial attendance:', error);
        });

        // Search for the user's instance in the attendance table
        
        // search for the user's instance in the attendance table (check to see if they are already selected to attend once)
        var requestInfoSearchInstance = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({rosterId}),
        }
        
        fetch(`/api/attendanceInstanceForMeeting/${meetingId}`, requestInfoSearchInstance)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok'); 
                }
                return response.json();
                })
            .then((data) => {
                console.log('Fetched attendance instance for user:', data.attended); // Add this console log

                if(data.attended.length > 0) {
                    // Set the isAttended state to true if the user's instance is found
                    const userInstance = data.attended[0];
                    console.log('User instance found for meeting', userInstance.meeting_id); // Add this console log
                    setIsAttendedInstance(true);
                    console.log('confimation on user instance', isAttendedInstance); // Add this console log
                   
                   // Set the isAttended state to true if the user's instance is found and they are attended
                    if (userInstance.isAttended === 1)
                        {setIsAttended(true);}
                    else
                        {setIsAttended(false);}
                }
                else {
                    setIsAttendedInstance(false);
                    setIsAttended(false);
                }
            })
        
    }, [meeting.id, isAttendedInstance, isAttended, rosterPropId]);


    // Add the user to the attendance table
    const handleAddAttendance = (meeting, rosterPropId) => {
        var meetingId = meeting.id;
        var rosterIdAdd = rosterPropId;

        console.log('Adding user from attendance table:', meetingId, rosterIdAdd);

        var requestInfoAddInstance = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({rosterIdAdd})
        }

        var requestInfoUpdateInstance = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({rosterIdAdd})
        }
        if (isAttendedInstance) {
            console.log('User is already has an instance in attendance table', isAttendedInstance);
            // Update the user's instance in the attendance table
            fetch(`/api/setAttendance/${meetingId}`, requestInfoUpdateInstance)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                })
                .then((data) => {
                    console.log('Updated attendance instance code:', data);
                    setIsAttended(true);     
                })
        
            }
        else {
            console.log('User does not have an instance in attendance table', isAttendedInstance);
            fetch(`/api/newAttendanceInstance/${meetingId}`, requestInfoAddInstance)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                        console.log('Added new attendance instance:', data);
                        setIsAttended(true);
                })
            }
    };

    // Remove the user from the attendance table
    const handleRemoveAttendance = (meeting, rosterPropId) => {
        var meetingId = meeting.id;
        var rosterIdRem = rosterPropId;

        console.log('Removing user from attendance table:', meetingId, rosterIdRem);
        
        var requestInfoUpdateInstance = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({rosterIdRem})
        }
        if (isAttendedInstance) {
            if (isAttended) {
                // Update the user's instance in the attendance table
                fetch(`/api/resetAttendance/${meetingId}`, requestInfoUpdateInstance)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                    })
                    .then((data) => {
                        console.log('Updated attendance instance code:', data);
                        setIsAttended(false);  
                    })
                }
            
            }
        else{
            console.log('User is not in attendance table');
        }
    };

    return (
        <div>
            <div className="club_content">
                <div className="cols">
                    <div className="practice_boxes">
                        <div className="practice_info">
                            <h5>{meeting.name}</h5>
                            <p>{meeting.location}</p>
                            <p>{new Date(meeting.date).toLocaleDateString()}</p>
                            <p>{meeting.time}</p>
                        </div>
                        <div className="practice_attend">
                            {!isAttended && (
                                <button
                                    className='submit'
                                    type="button"
                                    onClick={() => handleAddAttendance(meeting, rosterPropId)}
                                >
                                    Attend
                                </button>
                            )}
                            {isAttended && (
                                <button
                                    className='submit'
                                    type="button"
                                    onClick={() => handleRemoveAttendance(meeting, rosterPropId)}
                                >
                                    Leave
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="attendance_table_box">
                        <h3>Attendance Table</h3>
                        <ul>
                            {attendanceTable.map((user) => (
                                <li key={user.id}>{user.name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ClubEntry = () => {
    // navigate to other pages
    const NavigateToAdmin = useNavigateToPage('/admin/login');
    
    const handleAdmin = () => {
            NavigateToAdmin();
    };

    ///////////////////////////////
    // values for club names and ids
    const [clubs, setClubs] = useState([]);
    const [currClub, setCurrClub] = useState(null);
    const [meetings, setMeetings] = useState([]); 
    const [filteredMeetings, setFilteredMeetings] = useState([]);

    // Dropdown for selecting a club (AT this point I need to make it its own component)
    const ClubDropdown = () => {  // on event change the current club meetings to selected club  // how do I set a club up by default?
        // Sort the clubs based on their ID
        const sortedClubs = clubs.slice().sort((a, b) => a.ID - b.ID);
        
        const handleClubChange = (event) => {
            const selectedClubId = event.target.value;
            console.log(selectedClubId);
            setCurrClub(parseInt(selectedClubId , 10));
        };

        return (
        <select value={currClub || ''} onChange={handleClubChange}>
            {sortedClubs.map((club, index) => (
                <option key={`opt${index}`} value={club.ID}>
                    {club.name}
                </option>
            ))}
        </select>
        );
    }

    ///////////////////////////////
    // State to store user's roster information
    const [userRosters, setUserRosters] = useState([]);
    const [filteredUserRoster, setFilteredUserRoster] = useState([]);

    // Fetch user's roster when currClub changes
    useEffect(() => {
        var requestInfo = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            }
         // Ensure currClub is not null before making the request
         if (currClub !== null) {
            fetch('/api/userRoster', requestInfo)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                const userRosterList = data.roster;
                setUserRosters(userRosterList);
                console.log('Fetched user roster:', userRosterList); // Add this console log

                // Filter the user roster based on the selected club
                const filteredUserRosterData = userRosterList.filter((rosterItem) => rosterItem.club_id === parseInt(currClub));
                console.log('Filtered user roster:', filteredUserRosterData); // Add this console log
                setFilteredUserRoster(filteredUserRosterData);
            })
        .catch((error) => {
            console.error('Error fetching user roster:', error);
        });
        }
    }, [currClub]);
    
    ///////////////////////////////
    // this will get the clubs and meetings for the user and generate them on the page
    useEffect(() => {
        var requestInfo = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        }

        // Fetch the user's clubs 
        fetch('/api/userClub', requestInfo)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                const clubIdentifiers = data.clubs;
                setClubs(clubIdentifiers);

                // Set the current meeting to the ID of the first club by default also checks if the user has a club
                if (clubIdentifiers.length > 0 && clubIdentifiers[0].hasOwnProperty('ID')) {
                    const firstClubId = clubIdentifiers[0].ID;
                    setCurrClub(firstClubId);
                } 
                else {
                    console.error('ID property not found in the first club or data structure incorrect.');
                }
            })
            .catch((error) => {
                console.error('Error fetching user clubs:', error);
            });
        
        // Fetch the meetings for the user's clubs
        fetch('/api/rosterMeeting', requestInfo)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                const meetIdentifier = data.meetings;
                console.log('Fetched meetings:', meetIdentifier); // Add this console log
                setMeetings(meetIdentifier);
                // Set current meeting to the first club's ID, by ensuring it exists and setting it immeadiatly to the first's clubid
                setCurrClub(meetIdentifier.length > 0 ? meetIdentifier[0].club_Id : null); 
            })
            .catch((error) => {
                console.error('Error fetching club meetings:', error);
            });
    }, []);

    ///////////////////////////////
    // Filtering the meetings based on the selected club
    useEffect(() => {
        console.log('total meetings:', meetings); // Add this console log
        const filteredMeetingsData = meetings.filter(meeting => meeting.club_Id === parseInt(currClub));
        console.log('Club Selected:', currClub);
        console.log('Filtered meetings:', filteredMeetingsData); // Add this console log
        setFilteredMeetings(filteredMeetingsData);
        
    }, [currClub, meetings]);

    ///////////////////////////////
    // generate the meetings, dropdown, and admin button
    return (
        <div className="container">

            <div className="user_roster">
                <h3>User's Roster Information</h3>
                <ul>
                    {filteredUserRoster.map((rosterItem) => (
                        <li key={rosterItem.id}>
                            Roster ID: {rosterItem.id} | Role: {rosterItem.isOfficer === 1 ? 'Officer' : 'Member'}
                        </li>
                    )// Filter by the current club (bring this into the other useEffect to be able to assign it to a new variable to be used in attendance)
                    )}
                </ul>
            </div>

            {/* Conditionally render the admin button */}
        {filteredUserRoster.some((rosterItem) => rosterItem.isOfficer === 1) && (
            <button className="submit" type="button" onClick={handleAdmin}>
                Admin
            </button>
        )}

            <ClubDropdown />

            <div className="cols">
                <div className="club_meetings">
                    <h3>Meetings</h3>
                    {filteredMeetings.map((meeting, index) => (
                        <MeetingList
                            key={`meeting${index}`}
                            meeting={meeting}
                            roster={filteredUserRoster}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
export default ClubEntry;
