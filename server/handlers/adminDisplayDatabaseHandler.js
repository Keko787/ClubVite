const pool = require('./databaseConfig');

module.exports = {
    databaseAdminClubList: async (adminId) => {
        try {
            var sqlQuery = `SELECT club.ID, club.name
                            FROM club
                            JOIN admin ON club.ID = admin.club_ID
                            WHERE admin.ID = ?`;
            const [results] = await pool.query(sqlQuery, [adminId], (error) => {
                if (error) {
                    console.error('Error querying database:', error);
                    return 'Internal server error';
                }
            }
            );
            if (results.length > 0) {
                const club = results.map((row) => ({ ID: row.ID, name: row.name }));
                console.log('Club associated with the admin:', club);
                return club;
            } else {
                console.log('No clubs found');
                return [];
            }
        } catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },
    
    databaseAdminMeetingList: async (adminID) => {
        try {
            var sqlQuery = `SELECT meeting.*
                            FROM meeting
                            JOIN club ON meeting.club_Id = club.ID
                            JOIN admin ON club.ID = admin.club_ID
                            WHERE admin.ID = ?`;
            const [results] = await pool.query(sqlQuery, [adminID], (error) => {
                    if (error) {
                        console.error('Error querying database:', error);
                        return 'Internal server error';
                    }}
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
                console.log('Meetings listed:', meetings);
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

    databaseAdminRosterList: async (adminId) => {
        try {
            var sqlQuery = `SELECT roster.*, user.name, user.username
                            FROM roster
                            JOIN club ON roster.club_id = club.ID
                            JOIN admin ON club.ID = admin.club_ID
                            JOIN user ON roster.member_id = user.id
                            WHERE admin.ID = ?`;
            const [results] = await pool.query(sqlQuery, [adminId], (error) => {
                if (error) {
                    console.error('Error querying database:', error);
                    return 'Internal server error';
                }
            }
            );
            if (results.length > 0) {
                const roster = results.map((row) => ({
                    id: row.id,
                    club_id: row.club_id,
                    member_id: row.member_id,
                    year: row.year,
                    isOfficer: row.isOfficer,
                    name: row.name,
                    username: row.username
                }));
                console.log('Members listed:', roster);
                return roster;
            } else {
                console.log('No members found');
                return [];
            }
        } 
        catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },
}