const pool = require('./databaseConfig');

module.exports = {
    databaseClubList: async (userId) => {
        try {
            var sqlQuery = `SELECT club.ID, club.name
                 FROM club
                 JOIN roster ON club.ID = roster.club_id
                 JOIN user ON roster.member_id = user.id
                 WHERE user.id = ?`;
            const [results] = await pool.query(sqlQuery, [userId], (error) => {
                if (error) {
                    console.error('Error querying database:', error);
                    return 'Internal server error';
                }
            });
            if (results.length > 0) {
                const clubs = results.map((row) => ({ ID: row.ID, name: row.name }));
                console.log('Club names associated with the user:', clubs);
                return clubs;
            } else {
                console.log('No clubs found');
                return [];
            }
        } catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },

    // Function to add attendance entry (if needed to be for all rosters in the club, then remove roster.club_id = ? in where clause)
    databaseRosterCheck: async (userId) => 
    {
        try {
            // Modify your SQL query to check for both user ID and club ID
            var sqlQuery = `SELECT roster.id, roster.year, roster.club_id, roster.member_id, roster.isOfficer
                            FROM roster
                            JOIN user ON roster.member_id = user.id
                            WHERE user.id = ?`;
            const [results] = await pool.query(sqlQuery, [userId], (error) => {
                if (error) {
                    console.error('Error querying database:', error);
                    return 'Internal server error';
                }
            });
            if (results.length > 0) {
                const userRosterInfo = results.map((row) => ({
                    id: row.id,
                    year: row.year,
                    club_id: row.club_id,
                    member_id: row.member_id,
                    isOfficer: row.isOfficer
                }));  // grab the ids of the rosters the user is in
                console.log('Roster information associated with the user:', userRosterInfo);
                return userRosterInfo;
            } else {
                console.log('No roster information found');
                return [];
            }
        } catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },


    databaseMeetingList: async (userId) => {
        try {
            var sqlQuery = `SELECT meeting.id, meeting.name, meeting.time, meeting.date, meeting.location, meeting.club_Id
                            FROM meeting
                            JOIN club ON meeting.club_Id = club.ID
                            JOIN roster ON club.ID = roster.club_id
                            JOIN user ON roster.member_id = user.id
                            WHERE user.id = ?`
            const [results] = await pool.query(sqlQuery, [userId], (error) => {
                if (error) {
                    console.error('Error querying database:', error);
                    return 'Internal server error';
                }
            }
            );
            if (results.length > 0) {
                const meetings = results.map((row) => ({
                    id: row.id,
                    name: row.name,
                    time: row.time,
                    date: row.date,
                    location: row.location,
                    club_Id: row.club_Id
                }));
                console.log('Meetings associated with the user:', meetings);
                return meetings;
            } else {
                console.log('No meetings found');
                return [];
            }
        } catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },

    databaseAttendanceList: async (userId, meetingId) => {
        try {
            var sqlQuery = `SELECT attendance.ID, attendance.roster_id, attendance.member, attendance.isAttended, attendance.meeting_id, user.name
                            FROM attendance
                            JOIN user ON attendance.member = user.id
                            WHERE isAttended = 1 AND meeting_id = ?`
            const [results] = await pool.query(sqlQuery, [userId, meetingId], (error) => {
                if (error) {
                    console.error('Error querying database:', error);
                    return 'Internal server error';
                }
            }
            );
            if (results.length > 0) {
                const attendance = results.map((row) => ({
                    ID: row.ID,
                    meeting_id: row.meeting_id,
                    member: row.member,
                    isAttended: row.isAttended,
                    roster_id: row.roster_id,
                    name: row.name
                }));
                console.log('Attendance associated with the user:', attendance);
                return attendance;
            } else {
                console.log('No attendance found');
                return [];
            }
        } catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },
};
