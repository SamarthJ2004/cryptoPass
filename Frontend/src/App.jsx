import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import './styles/nft.css';
import Background from './components/Background.jsx';
import MainContent from './components/MainContent.jsx';
import Organiser from './components/Organiser.jsx';
import RootLayout from './components/Layout.jsx';
import User from "./components/User.jsx";
import EventDetails from "./components/EventDetails.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
            <Navbar />
              <Background />
              <MainContent />
            </>
          } />
          <Route path="/create-event" element={<Organiser />} />
          <Route path="/sign-in" element={<RootLayout />}/>
          {/* <Route path="/user" element={<User />}/> */}
          {/* <Route path="/event-detail" element={<EventDetails />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;