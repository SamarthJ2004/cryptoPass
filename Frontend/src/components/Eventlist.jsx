import React, { useState, useEffect } from 'react';
import '../styles/Eventlist.css';

const EventList = () => {
  const [concerts, setConcerts] = useState([]);

  useEffect(() => {
    const fetchConcerts = async () => {
      const response = await fetch('http://localhost:3011/api/concerts');
      const data = await response.json();
      setConcerts(data);
    };

    fetchConcerts();
  }, []);

  return (
    <div className="event-list-container">
      <h2 className="event-list-heading">Upcoming Concerts</h2>
      {concerts.map((concert, index) => (
        <div key={index} className="concert-card">
          <h3 className="concert-title">{concert.concertName} - {concert.artistName}</h3>
          <p className="concert-details">Date: {concert.date} Time: {concert.time}</p>
          <p className="concert-details">Venue: {concert.venue}</p>
          <p className="concert-details">Description: {concert.description}</p>
          <p className="concert-details price-highlight">Regular Price: ${concert.regularPrice} (Count: {concert.regularCount})</p>
          <p className="concert-details price-highlight">VIP Price: ${concert.vipPrice} (Count: {concert.vipCount})</p>
        </div>
      ))}
    </div>
  );
};

export default EventList;
