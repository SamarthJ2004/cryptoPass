
import { useState } from 'react';
import '../styles/Organiser.css'
import usePinata from '../../utils/config.js'
 

const Organiser = () => {

  //pinata 
  const pinata = usePinata();
  const [selectedFile, setSelectedFile] = useState(null);

  const changeHandler = (event) => {
    
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmission = async () => {
    if (!selectedFile) {
      console.log("No file selected");
      return;
    }

    try {
      const upload = await pinata.upload.file(selectedFile);
      console.log(upload);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };
  //pinata


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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    const response = await fetch('http://localhost:3011/api/concerts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      alert('Concert data added successfully!');
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
      <button type="submit">Add Concert</button>
      <div className="form-container">
      <label className="form-label">Choose File</label>
      <input
        type="file"
        className="form-input"
        onChange={changeHandler}
      />
      <button
        className="form-button"
        onClick={handleSubmission}
        disabled={!selectedFile}
      >
        Submit
      </button>
    </div>
    </form>
    
    </div>
  );
};

export default Organiser;
