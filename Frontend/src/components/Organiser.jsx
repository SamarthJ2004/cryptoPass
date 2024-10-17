import React, { useState,useEffect } from 'react';
import Navbar from "./Navbar";
import { contract } from '../config';
import {ethers} from "ethers";
import cryptoPass from "../TicketMarketplace.json";

const ConcertRegistrationForm = (currentAccount) => {
  const [concertName, setConcertName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [ticketsAvailable, setTicketsAvailable] = useState('');
  const [poster, setPoster] = useState(null);
  const [contactEmail, setContactEmail] = useState('');
  const [category, setCategory] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [lastEvent, setLastEvent] = useState(null);

  const addEvent = async () => {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const CryptoPassContract = new ethers.Contract(
        contract,
        cryptoPass.abi,
        signer
      );

      const eventDate = new Date(dateTime).getTime() / 1000;

      const tx = await CryptoPassContract.createEvent(
        artistName.substring(0, 3).toUpperCase(),
        "R",
        ticketsAvailable,
        ticketPrice,
        eventDate
      );

      console.log("Transaction sent, waiting for confirmation...");
      const receipt = await tx.wait(); // Wait for the transaction to be mined

      console.log("Transaction confirmed!");

      // Wait for a few seconds to ensure the event has been indexed
      setTimeout(async () => {
        await getCreateEvents(CryptoPassContract);
      }, 5000); // Wait for 5 seconds
    } else {
      console.log("Ethereum object doesn't exist");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const getCreateEvents = async (CryptoPassContract) => {
  const events = await CryptoPassContract.queryFilter("EventCreated");
  
  console.log("Past EventCreated events:");
  events.forEach(event => {
    const { eventId, bandId, eventNumber, maxTickets, ticketPrice, tokenIds } = event.args;
    console.log("Event ID:", eventId.toString());
    console.log("Band ID:", bandId);
    console.log("Event Number:", eventNumber.toString());
    console.log("Max Tickets:", maxTickets.toString());
    console.log("Ticket Price:", ticketPrice.toString());
    console.log("Token IDs:", tokenIds.map(id => id.toString()));
  });

  const {eventId, bandId, eventNumber, maxTickets, ticketPrice, tokenIds} = events[events.length-1].args;
  setLastEvent({
    eventId: eventId.toString(),
    bandId,
    eventNumber: eventNumber.toString(),
    maxTickets: maxTickets.toString(),
    ticketPrice: ticketPrice.toString(),
    tokenIds: tokenIds.map(id => id.toString()),
  });
};

  const handleSubmit = (e) => {
    e.preventDefault();
    addEvent();
    console.log({
      concertName,
      artistName,
      dateTime,
      venue,
      description,
      ticketPrice,
      ticketsAvailable,
      poster,
      contactEmail,
      category,
      additionalInfo,
    });

    setConcertName('');
    setArtistName('');
    setDateTime('');
    setVenue('');
    setDescription('');
    setTicketPrice('');
    setTicketsAvailable('');
    setPoster(null);
    setContactEmail('');
    setCategory('');
    setAdditionalInfo('');
  };

  const LastEventDetails = () => (
    <div className="event-details">
      <h3>Last Event Created</h3>
      {lastEvent ? (
        <ul>
          <li><strong>Event ID:</strong> {lastEvent.eventId}</li>
          <li><strong>Band ID:</strong> {lastEvent.bandId}</li>
          <li><strong>Event Number:</strong> {lastEvent.eventNumber}</li>
          <li><strong>Max Tickets:</strong> {lastEvent.maxTickets}</li>
          <li><strong>Ticket Price:</strong> {lastEvent.ticketPrice}</li>
          <li><strong>Token IDs:</strong> {lastEvent.tokenIds.join(', ')}</li>
        </ul>
      ) : (
        <p>No event created yet.</p>
      )}
    </div>
  );

  return (
    <>
    <Navbar/>
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form-title">Concert Registration</h2>
        
        <div className="form-group">
          <label htmlFor="concertName">Concert Name:</label>
          <input
            type="text"
            id="concertName"
            value={concertName}
            onChange={(e) => setConcertName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="artistName">Artist/Band Name:</label>
          <input
            type="text"
            id="artistName"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateTime">Date & Time:</label>
          <input
            type="datetime-local"
            id="dateTime"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="venue">Venue:</label>
          <input
            type="text"
            id="venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="ticketPrice">Ticket Price:</label>
          <input
            type="number"
            id="ticketPrice"
            value={ticketPrice}
            onChange={(e) => setTicketPrice(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ticketsAvailable">Tickets Available:</label>
          <input
            type="number"
            id="ticketsAvailable"
            value={ticketsAvailable}
            onChange={(e) => setTicketsAvailable(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="poster">Upload Poster:</label>
          <input
            type="file"
            id="poster"
            onChange={(e) => setPoster(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactEmail">Contact Email:</label>
          <input
            type="email"
            id="contactEmail"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Event Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="rock">Rock</option>
            <option value="jazz">Jazz</option>
            <option value="classical">Classical</option>
            <option value="pop">Pop</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="additionalInfo">Additional Information:</label>
          <textarea
            id="additionalInfo"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
      {lastEvent && <LastEventDetails />}
    </div>
    </>
  );
};

const styles = `
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #1e1e1e;
    color: #ffffff;
    font-family: Arial, sans-serif;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-title {
    text-align: center;
    color: #ffffff;
    margin-bottom: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  label {
    font-weight: bold;
  }

  input,
  textarea,
  select {
    padding: 8px;
    border: 1px solid #444;
    border-radius: 4px;
    background-color: #333;
    color: #fff;
  }

  input[type="file"] {
    padding: 5px;
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  .submit-btn {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }

  .submit-btn:hover {
    background-color: #45a049;
  }
    .event-details {
    margin-top: 30px;
    background-color: #2d2d2d;
    padding: 15px;
    border-radius: 4px;
  }

  .event-details h3 {
    margin-bottom: 10px;
    color: #ffffff;
  }

  .event-details ul {
    list-style: none;
    padding: 0;
  }

  .event-details ul li {
    margin-bottom: 8px;
  }

  .event-details ul li strong {
    color: #ff6600;
  }
`;

export default ({currentAccount}) => (
  <>
    <style>{styles}</style>
    <ConcertRegistrationForm currentAccount={currentAccount} />
  </>
);