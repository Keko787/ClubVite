//set up
const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const { databaseLogin } = require('./handlers/loginDatabaseHandler.js');
const { databaseAdminLogin} = require('./handlers/adminLoginDatabaseHandler.js');
const { databaseRegister } = require('./handlers/registerDatabaseHandler.js');
const { databaseClubList, databaseMeetingList, databaseRosterCheck, databaseAttendanceList } = require('./handlers/dashboardDatabaseHandler.js');
const { databaseAdminClubList, databaseAdminRosterList, databaseAdminMeetingList } = require('./handlers/adminDisplayDatabaseHandler.js');
const { databaseAdminMeetingAdd, databaseAdminMeetingUpdate, databaseAdminMeetingDelete } = require('./handlers/adminMeetingEditDatabaseHandler.js');
const { databaseAdmin2MemberAdd, databaseAdmin2MemberUpdate, databaseAdmin2MemberDelete } = require('./handlers/adminRosterEditDatabaseHandler.js');
const { databaseNewAttendanceInstance, databaseSetAttendance, databaseResetAttendance, databaseAttendanceCheck} = require('./handlers/attendanceDatabaseHandler.js');
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '../client/build')));

app.use(
    session({
      secret: 'secret', // Add a secret key for session encryption
      resave: false,
      saveUninitialized: true,
    })
);

// Root directory
app.get(/^\/.*$/, (routeRequest, routeResult) => {
    routeResult.sendFile(path.join(__dirname, '../client/build/index.html')) 
});

// logins and account creation

// user login
app.post('/api/login', async (routeRequest, routeResult) => {
    var reqUsername = routeRequest.body.username;
    var reqPin = routeRequest.body.pin;
  
    var user = await databaseLogin(reqUsername, reqPin);
    if (user !== 'no user') {
      
      // Set user ID in the session
      routeRequest.session.userId = user.id;
      console.log(routeRequest.session.userId);
  
      var output = {
        message: `Login successful for U_ID: ${user.id}`,
        status: 'success',
      };
  
      console.log(output);
  
      routeResult.json(output);
    } 
    
    else {
      var output = {
        message: 'Login failed. Invalid credentials.',
        status: 'failure',
      };
  
      console.log(output);
  
      routeResult.json(output);
    }
  });

// admin login
app.post('/api/adminLogin', async (routeRequest, routeResult) => {
  var reqUsername = routeRequest.body.username;
  var reqPassword = routeRequest.body.password;

  var admin = await databaseAdminLogin(reqUsername, reqPassword);
  if (admin !== 'no admin') {
    
    // Set user ID in the session
    routeRequest.session.adminId = admin.ID;

    var output = {
      message: `Login successful for A_ID: ${admin.ID}`,
      status: 'success',
    };

    console.log(output);

    routeResult.json(output);
  } 
  
  else {
    var output = {
      message: 'Login failed. Invalid credentials.',
      status: 'failure',
    };

    console.log(output);

    routeResult.json(output);
  }
});

// user account creation
app.post('/api/register', async (routeRequest, routeResult) => {
  var reqUsername = routeRequest.body.username;
  var reqPin = routeRequest.body.pin;
  var reqName = routeRequest.body.name;

  var status = await databaseRegister(reqUsername, reqPin, reqName);
  var output = {
      "status": status
  };

  console.log(output);

  routeResult.json(output);
});

// user dashboard display

// clublist for dropdown
app.post('/api/userClub', async (req, res) => {
    // Check if the session exists
    console.log("fetch respond")
    if (req.session && req.session.userId) {
      
      const sessionId = req.session.userId;

      console.log(sessionId);

      try {
        var clubList = await databaseClubList(sessionId); // Pass the sessionId to the databaseClubList function
        // Use the session ID for further operations or to identify the user

        req.session.clubIds = clubList.map((club) => club.ID); // Store the club IDs in the session

        res.json({ clubs: clubList }); // Return the clubList as a JSON response
      } 
      catch (error) {
        // Handle any errors that occur during the database operation
        console.error('Error retrieving user clubs:', error);
        res.status(500).json({ error: 'Internal server error' }); // Return an error message
      }
    } 
    
    else {
        // Redirect the user to the login page if the session doesn't exist
        console.log("whoops: no sesh id");
        res.redirect('/');
    }
});

// meeting data
app.post('/api/rosterMeeting', async (req, res) => {
  // Check if the session exists
  console.log("fetch respond")
  if (req.session && req.session.userId) {
    
    const sessionId = req.session.userId;

    console.log(sessionId);

    try {
      var meetingList = await databaseMeetingList(sessionId); // Pass the sessionId to the databaseClubList function
      // Use the session ID for further operations or to identify the user
      res.json({ meetings: meetingList }); // Return the clubList as a JSON response
    } 
    catch (error) {
      // Handle any errors that occur during the database operation
      console.error('Error retrieving user clubs:', error);
      res.status(500).json({ error: 'Internal server error' }); // Return an error message
    }
  } 
  
  else {
      // Redirect the user to the login page if the session doesn't exist
      console.log("whoops: no sesh id");
      res.redirect('/');
  }
});


// roster data (i can either grab the roster data whole or by club id)
app.post('/api/userRoster', async (req, res) => 
{

  // Check if the session exists
  console.log("fetch respond")
  if (req.session && req.session.userId) {
      
      const sessionId = req.session.userId;
      console.log(sessionId);
  
      try {
        var rosterList = await databaseRosterCheck(sessionId); // Pass the sessionId to the databaseClubList function
        // Use the session ID for further operations or to identify the user
        req.session.rosterIds  = rosterList.map((roster) => roster.ID);// Store the roster IDs in the session

        res.json({ roster: rosterList }); // Return the clubList as a JSON response
      } 
      catch (error) {
        // Handle any errors that occur during the database operation
        console.error('Error retrieving user roster:', error);
        res.status(500).json({ error: 'Internal server error' }); // Return an error message
      }
    }
    else {
      // Redirect the user to the login page if the session doesn't exist
      console.log("whoops: no sesh id");
      res.redirect('/');
    }
    
  });



// checking if the user is an admin for the club they are accessing in the dropdown menu of the dashboard

// display the attendance rosters for each meeting
app.post('/api/attendanceRosterForMeeting/:meetingId', async (req, res) => {
  // Check if the session exists
  console.log("fetch respond")
  if (req.session && req.session.userId) {
    
    const meetingId = req.params.meetingId;

    console.log(meetingId);

    try {
      var attendanceList = await databaseAttendanceList(meetingId); // Pass the sessionId to the databaseClubList function
      // Use the session ID for further operations or to identify the user
      res.json({ attendances: attendanceList }); // Return the clubList as a JSON response 
      // the idea is to return the attendance list for each meeting and have it tied to the meeting id
     
    } 
    catch (error) {
      // Handle any errors that occur during the database operation
      console.error('Error retrieving attendances for meetings:', error);
      res.status(500).json({ error: 'Internal server error' }); // Return an error message
    }
  } 
  
  else {
      // Redirect the user to the login page if the session doesn't exist
      console.log("whoops: no sesh id");
      res.redirect('/');
  }

});


app.post('/api/attendanceInstanceForMeeting/:meetingId', async (req, res) => {
  // Check if the session exists
  console.log("fetch respond")
  if (req.session && req.session.userId) {

    const userId = req.session.userId;
    const meetingId = req.params.meetingId;

    console.log(meetingId);

    try {
      var attendanceCheck = await databaseAttendanceCheck(meetingId, userId); // Pass the sessionId to the databaseClubList function
      // if the user has an attendance instance for the meeting, return the instance
      // if the user does not have an attendance instance for the meeting, return an error message
      console.log(attendanceCheck);
      res.json({ attended: attendanceCheck }); // Return the clubList as a JSON response
    } 
    catch (error) {
      // Handle any errors that occur during the database operation
      console.error('Error retrieving attendances for meetings:', error);
      res.status(500).json({ error: 'Internal server error' }); // Return an error message
    }
  } 
  
  else {
      // Redirect the user to the login page if the session doesn't exist
      console.log("whoops: no sesh id");
      res.redirect('/');
  }

});

// user dashboard edit attendance rosters

// if user selects attendance, make an entry in the attendance table (those who don't select to attend at all will not have an entry for the meeting in question)
app.post('/api/newAttendanceInstance/:meetingId', async (routeRequest, routeResult) => {
  const reqMeetingId = routeRequest.params.meetingId;
  var reqUserId = routeRequest.session.userId;
  var reqRosterId = routeRequest.body.rosterIdAdd;

  console.log('Info to make new attendance instance', reqMeetingId, reqUserId, reqRosterId);

  var status = await databaseNewAttendanceInstance(reqMeetingId, reqUserId, reqRosterId);
  var output = {
      "status": status
  };

  console.log(output);

  routeResult.json(output);
});

// search 

// if user resets attendance, set attendance to 1
app.put(`/api/setAttendance/:meetingId`, async (routeRequest, routeResult) => { 
  const reqMeetingId = routeRequest.params.meetingId;
  var reqUserId = routeRequest.session.userId;
  var reqRosterId = routeRequest.body.rosterIdAdd;

  console.log('Info to set isAttended attendance instance', reqMeetingId, reqUserId, reqRosterId);

  var status = await databaseSetAttendance(reqMeetingId, reqUserId, reqRosterId);
  var output = {
      "status": status
  };

  console.log(output);

  routeResult.json(output);

});

// if user resets attendance, set attendance to 0
app.put(`/api/resetAttendance/:meetingId`, async (routeRequest, routeResult) => { 
  const reqMeetingId = routeRequest.params.meetingId;
  var reqUserId = routeRequest.session.userId;
  var reqRosterId = routeRequest.body.rosterIdRem;

  console.log('Info to reset isAttended attendance instance', reqMeetingId, reqUserId, reqRosterId);


  var status = await databaseResetAttendance(reqMeetingId, reqUserId, reqRosterId);
  var output = {
      "status": status
  };

  console.log(output);

  routeResult.json(output);

});


// if user reselects the attendance, set attendance to 1

// admin dashboard display

// getting admin club name to generate on dashboard
app.post('/api/adminClub', async (req, res) => {
  // Check if the session exists
  console.log("fetch respond")
  if (req.session && req.session.adminId) {
    
    const sessionId = req.session.adminId;

    console.log(sessionId);

    try {
      var clubList = await databaseAdminClubList(sessionId); // Pass the sessionId to the databaseClubList function
      // Use the session ID for further operations or to identify the user

      // set club id in session for later use
      req.session.clubId = clubList[0].ID;

      res.json({ club: clubList }); // Return the clubList as a JSON response
    } 
    catch (error) {
      // Handle any errors that occur during the database operation
      console.error('Error retrieving admin club:', error);
      res.status(500).json({ error: 'Internal server error' }); // Return an error message
    }
  } 
  
  else {
      // Redirect the user to the login page if the session doesn't exist
      console.log("whoops: no sesh id");
      res.redirect('/');
  }
});


// getting club's roster to generate on roster editor
app.post('/api/adminRoster', async (req, res) => {
  // Check if the session exists
  console.log("fetch respond")
  if (req.session && req.session.adminId) {
    
    const sessionId = req.session.adminId;

    console.log(sessionId);

    try {
      var memberList = await databaseAdminRosterList(sessionId); // Pass the sessionId to the databaseClubList function
      // Use the session ID for further operations or to identify the user
      res.json({ roster: memberList }); // Return the memberList as a JSON response
    } 
    catch (error) {
      // Handle any errors that occur during the database operation
      console.error('Error retrieving club roster:', error);
      res.status(500).json({ error: 'Internal server error' }); // Return an error message
    }
  } 
  
  else {
      // Redirect the user to the login page if the session doesn't exist
      console.log("whoops: no sesh id");
      res.redirect('/');
  }
});

// getting club's meetings to generate on meeting editor
app.post('/api/adminMeetings', async (req, res) => {
  // Check if the session exists
  console.log("fetch respond")
  if (req.session && req.session.adminId) {
    
    const sessionId = req.session.adminId;

    console.log(sessionId);

    try {
      var meetingList = await databaseAdminMeetingList(sessionId); // Pass the sessionId to the databaseClubList function
      // Use the session ID for further operations or to identify the user
      res.json({ meetings: meetingList }); // Return the clubList as a JSON response
    } 
    catch (error) {
      // Handle any errors that occur during the database operation
      console.error('Error retrieving club meetings:', error);
      res.status(500).json({ error: 'Internal server error' }); // Return an error message
    }
  } 
  
  else {
      // Redirect the user to the login page if the session doesn't exist
      console.log("whoops: no sesh id");
      res.redirect('/');
  }
});

// admin dashboard edit meetings

// add meeting
app.post('/api/addMeeting', async (routeRequest, routeResult) => {
  var reqName = routeRequest.body.name;
  var reqTime = routeRequest.body.time;
  var reqDate = routeRequest.body.date;
  var reqLocation = routeRequest.body.location;
  var reqClubId = routeRequest.session.clubId;

  var status = await databaseAdminMeetingAdd(reqName, reqTime, reqDate, reqLocation, reqClubId);
  var output = {
      "status": status
  };

  console.log(output);

  routeResult.json(output);
});

// edit meeting
app.put(`/api/updateMeeting/:meetingId`, async (routeRequest, routeResult) => {
  var reqMeetingId = routeRequest.params.meetingId;
  var reqName = routeRequest.body.name;
  var reqTime = routeRequest.body.time;
  var reqDate = routeRequest.body.date;
  var reqLocation = routeRequest.body.location;

  var status = await databaseAdminMeetingUpdate(reqName, reqTime, reqDate, reqLocation, reqMeetingId);
  var output = {
      "status": status
  };

  console.log(output);

  routeResult.json(output);
});

// delete meeting
app.delete(`/api/deleteMeeting/:meetingId`, async (routeRequest, routeResult) => {
  var reqMeetingId = routeRequest.params.meetingId;

  var status = await databaseAdminMeetingDelete(reqMeetingId);
  var output = {
      "status": status
  };

  console.log(output);

  routeResult.json(output);
});


// admin dashboard edit rosters

// add member
app.post('/api/addMember', async (routeRequest, routeResult) => {
  var reqYear = 2023;
  var reqUsername = routeRequest.body.userName;
  var reqRole = 0;
  var reqClubId = routeRequest.session.clubId;

  var status = await databaseAdmin2MemberAdd(reqYear, reqClubId, reqRole, reqUsername);
  var output = {
      "status": status
  };

  console.log(output);

  routeResult.json(output);
});

// edit member
app.put(`/api/updateMember/:memberId`, async (routeRequest, routeResult) => {
  var reqMemberId = routeRequest.params.memberId;
  var reqYear = routeRequest.body.year;
  var reqRole = routeRequest.body.role;

  var status = await databaseAdmin2MemberUpdate(reqYear, reqRole, reqMemberId);
  var output = {
      "status": status
  };

  console.log(output);

  routeResult.json(output);
});

// delete member
app.delete(`/api/deleteMember/:memberId`, async (routeRequest, routeResult) => {
  var reqMemberId = routeRequest.params.memberId;
  console.log(reqMemberId);
  var status = await databaseAdmin2MemberDelete(reqMemberId);
  var output = {
      "status": status
  };

  console.log(output);

  routeResult.json(output);
});

// Activiate the server
app.listen(2020, () => {
    console.log('server is listening on port 2020');
});