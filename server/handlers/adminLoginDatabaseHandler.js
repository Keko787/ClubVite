const pool = require('./databaseConfig');

module.exports = {
    databaseAdminLogin: async (username, password) => {
        try {
            var sqlQuery = `SELECT admin.* FROM admin WHERE username = ? AND password = ?`
            const [results] = await pool.query(sqlQuery, [username, password], (error) => {
                    if (error) {
                        console.error('Error querying database:', error);
                        return 'Internal server error';
                    }}
            );
            if (results.length > 0) {
                const admin = results[0];
                console.log('Admin found:', admin);     
                // Handle a successful login
                console.log('Login successful for admin:', username);
                return admin;
            } else {
                console.log('No admin with that username found');
                return 'no admin';
            }
        } catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },

    
}