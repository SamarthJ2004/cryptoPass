// Organiser.js
import React, { useState } from 'react';
import usePinata from '../../utils/config'; // Import your Pinata configuration
import '../styles/Organiser.css'


const Organiser = () => {
  const pinata= usePinata();

  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    concertName: '',
    artistName: '',
    date: '',
    time: '',
    venue: '',
    description: '',
    regularPrice: '',
    regularCount: '',
    vipPrice: '',
    vipCount: ''
  });

  const changeHandler = (event) => {
    setSelectedFile(event.target?.files[0]);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!selectedFile) {
        console.error("No file selected");
        return;
      }

      // Upload file to Pinata
      const upload = await pinata.upload.file(selectedFile);
      const ipfsHash = upload.IpfsHash;
      console.log("this" ,ipfsHash)

      // Store concert data along with IPFS hash in MongoDB
      const response = await fetch('http://localhost:3011/api/concerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, imageHash: ipfsHash }),
      });

      if (response.ok) {
        alert('Concert data added successfully!');
        // Reset form
        setFormData({
          concertName: '',
          artistName: '',
          date: '',
          time: '',
          venue: '',
          description: '',
          regularPrice: '',
          regularCount: '',
          vipPrice: '',
          vipCount: ''
        });
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error in submission:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="concertName" placeholder="Concert Name" value={formData.concertName} onChange={handleChange} required />
        <input type="text" name="artistName" placeholder="Artist Name" value={formData.artistName} onChange={handleChange} required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        <input type="text" name="venue" placeholder="Venue" value={formData.venue} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required></textarea>
        <input type="number" name="regularPrice" placeholder="Regular Price" value={formData.regularPrice} onChange={handleChange} required />
        <input type="number" name="regularCount" placeholder="Regular Count" value={formData.regularCount} onChange={handleChange} required />
        <input type="number" name="vipPrice" placeholder="VIP Price" value={formData.vipPrice} onChange={handleChange} required />
        <input type="number" name="vipCount" placeholder="VIP Count" value={formData.vipCount} onChange={handleChange} required />
        
        <label className="form-label">Choose File</label>
        <input type="file" onChange={changeHandler} />
        <button type="submit">Add Concert</button>
      </form>
    </div>
  );
};

export default Organiser;
