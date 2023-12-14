const pool = require('./databaseConfig');

module.exports = {

    databaseRegister: async (username, pin, name) => {
        try {
            var sqlQuery = `INSERT INTO user (username, pin, name) VALUES (?, ?, ?)`
            const [results] = await pool.query(sqlQuery, [username, pin, name], (error) => {
                    if (error) {
                        console.error('Error querying database:', error);
                        return 'Internal server error';
                    }}
            );
            if (results.affectedRows > 0) {
                console.log('Registration successful for user:', username);
                return(`Registration successful for username: ${username}`);
            } 
        } catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },

}
