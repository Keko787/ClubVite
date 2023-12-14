const pool = require('./databaseConfig');

module.exports = {
    
    databaseLogin: async (username, pin) => {
        try {
            var sqlQuery = `SELECT * FROM user WHERE username = ? AND pin = ?`;
            const [results] = await pool.query(sqlQuery, [username, pin], (error) => {
                    if (error) {
                        console.error('Error querying database:', error);
                        return 'Internal server error';
                    }
            }
            );
            if (results.length > 0) {
                const user = results[0];
                console.log('User found:', user);     
                // Handle a successful login
                console.log('Login successful for user:', username);
                return user;
            } else {
                console.log('No user with that username found');
                return 'no user';
            }
        } catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },

}