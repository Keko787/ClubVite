const pool = require('./databaseConfig');

module.exports = {
    // Function to search for user's attendance instance for the meeting
    databaseAttendanceCheck: async (meetingId, userId) =>
    {
        try
        {
            // Construct the SQL query
            const query = `SELECT * 
                            FROM attendance 
                            WHERE meeting_id = ? AND member = ?`;

            // Execute the SQL query
            const [results] = await pool.query(query, [meetingId, userId], (error) => {
                if (error) {
                    console.error('Error querying database:', error);
                    return 'Internal server error';
                }
            });

            if (results.length > 0) {
                console.log('Attendance instance found');
                const attendance = results.map((row) => ({
                    ID: row.ID,
                    meeting_id: row.meeting_id,
                    member: row.member,
                    isAttended: row.isAttended,
                    roster_id: row.roster_id
                }));
                console.log('Attendance associated with the user:', attendance);
                return attendance;
            }

            else {
                console.log('No attendance found');
                return [];
            }
        }
        catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },

    // Function to add attendance entry
    databaseNewAttendanceInstance: async (meetingId, userId, rosterId) => 
    {
        // Check if the user is already attending the meeting
        try 
        {
            const checkQuery = `SELECT * 
                                FROM attendance 
                                WHERE meeting_id = ? AND member = ?`;

            const [checkResults] = await pool.query(checkQuery, [meetingId, userId], (error) => {
                if (error) {
                    console.error('Error querying database:', error);
                    return 'Internal server error';
                }
            });

            if (checkResults.length > 0) {
                console.log('Attendance instance already exists');
                return 0;
            }

            else {
                // Construct the SQL query
                const query = `INSERT INTO attendance (meeting_id, member, roster_id, isAttended) 
                                VALUES (?, ?, ?, 1)`;

                // Execute the SQL query
                const [results] = await pool.query(query, [meetingId, userId, rosterId] , (error) => {
                    if (error) {
                        console.error('Error adding attendance instance:', error);
                    }
                });
                if (results.affectedRows > 0) {
                    console.log('Attendance instance added');
                    return 1;
                }
                else {
                    console.log('Attendance instance not added');
                    return 0;
                }
            }
        }
        catch (error) {   
            console.error('Error querying database:', error);
            throw error;
        }
    },

    // Function to update the attendance entry to 1
    databaseSetAttendance: async (meetingId, userId, rosterId) => 
    {
        try 
        {
            // Check if the user is already attending the meeting
            const checkQuery = `SELECT * FROM attendance WHERE meeting_id = ? AND member = ?`;
            const [checkResults] = await pool.query(checkQuery, [meetingId, userId], (error) => {
                if (error) {
                    console.error('Error querying database:', error);
                    return 'Internal server error';
                }
            }
            );

            if (checkResults.length == 0) {
                console.log('Attendance instance does not exist');
                return 0;
            }
            else {
                // Construct the SQL query
                const query = `UPDATE attendance 
                                SET isAttended = 1 
                                WHERE meeting_id = ? AND member = ? AND isAttended = 0 AND roster_id = ?`;

                // Execute the SQL query
                const [results] = await pool.query(query, [meetingId, userId, rosterId], (error) => {
                    if (error) {
                        console.error('Error updating attendance:', error);
                    }
                });
                
                if (results.affectedRows > 0) {
                        console.log('Attendance updated');
                        return 1; 
                    }

                    else {
                        console.log('Attendance not updated');
                        return 0;
                    }
            }
        }
        catch (error) {   
            console.error('Error querying database:', error);
            throw error;
        }
    },
    
    // Function to update the attendance entry to 0
    databaseResetAttendance: async (meetingId, userId, rosterId) => 
    {
        try 
        {
            // Check if the user is already attending the meeting
            const checkQuery = `SELECT * 
                                FROM attendance 
                                WHERE meeting_id = ? AND member = ?`;
            const [checkResults] = await pool.query(checkQuery, [meetingId, userId], (error) => {
                if (error) {
                    console.error('Error querying database:', error);
                    return 'Internal server error';
                }
            }
            );

            if (checkResults.length == 0) {
                console.log('Attendance instance does not exist');
                return 0;
            }
            else {
                // Construct the SQL query
                const query = `UPDATE attendance 
                                SET isAttended = 0 
                                WHERE meeting_id = ? AND member = ? AND isAttended = 1 AND roster_id = ?`;

                // Execute the SQL query
                pool.query(query, [meetingId, userId, rosterId], (error, results) => {
                    if (error) {
                        console.error('Error removing attendance:', error);
                    }
                    if (results.affectedRows > 0) {
                        console.log('Attendance removed');
                        return 1;
                    }
                });
            }
        }
        catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
        
    },
    
    
};
