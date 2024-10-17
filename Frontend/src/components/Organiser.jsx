import React, { useState } from 'react';

const ConcertRegistrationForm = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
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
  };

  return (
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
    </div>
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
`;

export default () => (
  <>
    <style>{styles}</style>
    <ConcertRegistrationForm />
  </>
);