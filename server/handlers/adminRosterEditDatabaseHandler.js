const pool = require('./databaseConfig');

module.exports = {
    databaseAdmin2MemberAdd: async (year, clubId, role, username) => {
        try {
            console.error(year, clubId, role, username);
            var sqlQuery = `INSERT INTO roster (year, club_id, member_id, isOfficer)
                            SELECT ?, ?, user.id, ?
                            FROM user
                            WHERE user.username = ?;`;
            const [results] = await pool.query(sqlQuery, [year,clubId,role,username], (error) => {
                if (error) {
                    console.error('Error querying database:', error);
                    return 'Internal server error';
                }
            }
            );
            if (results.affectedRows > 0) {
                console.log('Member successfully added:', username);
                return(`Member successfully added: ${username}`);
            }
        } catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },
    
    databaseAdmin2MemberUpdate: async (year, role, memberId) => {
        try {
            var sqlQuery = `UPDATE roster
                            SET year = ?, isOfficer = ?
                            WHERE id = ?;`;
            const [results] = await pool.query(sqlQuery, [year, role, memberId], (error) => {
                    if (error) {
                        console.error('Error querying database:', error);
                        return 'Internal server error';
                    }}
            );
            if (results.affectedRows > 0) {
                console.log('Member updated successfully:', memberId);
                return(`Member updated successfully: ${memberId}`);
            }
        } catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },

    databaseAdmin2MemberDelete: async (memberId) => {
        try {
            var sqlQuery = `DELETE FROM roster WHERE id = ?;`;
            const [results] = await pool.query(sqlQuery, [memberId], (error) => {
                if (error) {
                    console.error('Error querying database:', error);
                    return 'Internal server error';
                }
            }
            );
            if (results.affectedRows > 0) {
                console.log('Member successfully deleted:', memberId);
                return(`Member successfully deleted: ${memberId}`);
            }
        } 
        catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    },
}