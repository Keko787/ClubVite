import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminHome from "./pages/AdminHome.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import NoPage from "./pages/NoPage.jsx";
import RosterForm from "./components/RosterForm.jsx";
import MeetingForm from "./components/MeetingForm.jsx";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<NoPage />} />

        <Route path="/admin">
          <Route path="home" element={<AdminHome />} />
          <Route path="rosterEditor" element={<RosterForm/>} />
          <Route path="meetingEditor" element={<MeetingForm/>} />
          <Route path="login" element={<AdminLogin />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
  </Router>
  );
}

export default App;
