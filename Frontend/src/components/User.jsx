import React from 'react';
import satoru_gozo from '../images/satoru_gozo.jpg';
import jonitaGandhi from '../images/jonitaGandhi.jpeg';
import mohitChauhan from '../images/mohitChauhan.jpeg';
import monaliThakur from '../images/monaliThakur.jpg';
import '../styles/User.css';

const projects = [
  { id: 1, title: 'Built for Digital', views: '3.5k', likes: 234, price: '$4.99', image: jonitaGandhi },
  { id: 2, title: 'A Blue Past', views: '2.1k', likes: 156, price: '$3.99', image: mohitChauhan },
  { id: 3, title: 'Between Spaces Algorithm', views: '4.2k', likes: 321, price: '$5.99', image: monaliThakur },
];

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <div className="header"></div>
      <div className="content">
        <div className="profile-info">
          <div className="avatar">
            <img src={satoru_gozo} alt="Profile" />
          </div>
          <div className="user-details">
            <h1>Satoru Gozo</h1>
            <p>Digital Artist & Designer</p>
          </div>
          <button className="follow-button">+ Follow</button>
        </div>
        
        <div className="stats">
          <div className="stat-item">
            <div className="stat-value">86</div>
            <div className="stat-label">Projects</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">64</div>
            <div className="stat-label">Followers</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">38</div>
            <div className="stat-label">Following</div>
          </div>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <img src={project.image} alt={project.title} />
              <div className="project-details">
                <h3>{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default ProfilePage;