const pool = require('./databaseConfig');

module.exports = {
    databaseAdminMeetingAdd: async (name, time, date, location, clubId) => {
        try {
            var sqlQuery = `INSERT INTO meeting (name, time, date, location, club_Id) VALUES (?, ?, ?, ?, ?)`;
            const [results] = await pool.query(sqlQuery, [name,time,date,location,clubId], (error) => {
                if (error) {
                    console.error('Error querying database:', error);
                    return 'Internal server error';
                }
            }
            );
            if (results.affectedRows > 0) {
                console.log('Meeting successfully made:', name);
                return(`Meeting successfully made: ${name}`);
            } 
        } catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },
    
    databaseAdminMeetingUpdate: async (name, time, date, location, meetingId) => {
        try {
            var sqlQuery = `UPDATE meeting
                            SET name = ?, time = ?, date = ?, location = ?
                            WHERE id = ?;`;
            const [results] = await pool.query(sqlQuery, [name, time, date, location, meetingId], (error) => {
                    if (error) {
                        console.error('Error querying database:', error);
                        return 'Internal server error';
                    }}
            );
            if (results.affectedRows > 0) {
                console.log('Meeting successfully updated:', meetingId);
                return(`Meeting successfully updated: ${meetingId}`);
            }
        } catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },

    databaseAdminMeetingDelete: async (meetingId) => {
        try {
            var sqlQuery = `DELETE FROM meeting WHERE id = ?;`;
            const [results] = await pool.query(sqlQuery, [meetingId], (error) => {
                if (error) {
                    console.error('Error querying database:', error);
                    return 'Internal server error';
                }
            }
            );
            if (results.affectedRows > 0) {
                console.log('Meeting successfully deleted:', meetingId);
                return(`Meeting successfully deleted: ${meetingId}`);
            }
        } 
        catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },
}