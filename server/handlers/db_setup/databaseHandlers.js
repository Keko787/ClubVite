
module.exports = {
    databaseRead: () => {
        // print to terminal
        console.log("reading from database")
        
        //init
        var record_id = document.getElementById('record_id').value
    
        // fetch
        fetch("//localhost:2020/user/"+ record_id)
        .then((response) =>{
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`)
            }
            return response.text();
        })
        .then((text) => {
            console.log("text = " + text)
            document.getElementById("database_server_read_result").innerHTML = text
        })
        .catch((error) => console.log('trouble - ' + error));        
    },
    findUserOnId: (req) => {
        // print in terminal
        console.log("inside of read/GET function")
        
        // init
        var id = req.params.id

        // make connection
        connection.connect(function(err) {
            if (err) throw err;  // error handling
            console.log("Connected!");  // print connection

            // makes sql query to db
            var sqlQuery = `SELECT * FROM users WHERE ID ="${id}"`;
            connection.query(sqlQuery, function (err, queryResult, fields) {
                if (err) throw err;  // error handling

                // Check if any records were found
                if (queryResult.length === 0) {
                    // Send a response indicating that no records were found
                    return routeResult.status(404).json({
                        message: 'No user found with the provided ID.'
                    });
                }

                // print the record read
                //console.log("1 record read: " + queryResult[0].name)
                
                // ?
                routeResult.json({
                    message: 'Retrieved record ' + queryResult[0].name
                });
            });
        });
    },
    writeToDatabase: () => {
        // print in terminal
        console.log("inside of POST function")
    
        // init
        let user = routeRequest.body
        let name = user.name
    
        // make connection
        connection.connect(function(err) {
            if (err) throw err;  // error handling
            console.log("Connected!");
    
            // state name of user
            console.log(name);
    
            // querying the database to insert the name into the user
            var sqlQuery = `INSERT INTO users (name) VALUES ("${name}")`;
            connection.query(sqlQuery, function (err, queryResult) {
                if (err) throw err;  // error handling
    
                // print/give the id of the new user
                console.log("1 record insert, ID:" + queryResult.insertId);  // give an ID?
                
                // ?
                routeResult.json({
                    message: 'Inserted record ' + queryResult.insertId
                });
            });
        });
    },
    databaseWrite: () => {
        // print to terminal
        console.log("writing to database")
    
        // init
        var user_name = document.getElementById('user_name').value;
    
        var user = {
            name: user_name
        }
        
        var requestInfo = {
            method: "POST",
            body: JSON.stringify(user),
            headers: {'Content-Type': 'application/json'}
        }
    
        // fetch
        fetch("//localhost:2020/user", requestInfo)
            .then((response) =>{
                // print in terminal the response
                console.log("resonse = " + response)
                
                // error handling
                if (!response.ok) {  
                    throw new Error(`Http error: ${response.status}`);
                }
                
                // return response string
                return response.text()
            })
            .then((text) => {
                //print in terminal the text from response
                console.log("text = " + text)
    
                // make the result = text
                document.getElementById("database_server_write_result").innerHTML = text
            })
            .catch((error) => console.log("trouble - " + error));  // error handling
    }
  };
