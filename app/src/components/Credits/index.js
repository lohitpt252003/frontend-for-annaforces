


import React from 'react';
import './index.css'; // Import the CSS file

function Credits() {
  const contributions = [
    {
      name: 'Lohit P Talavar',
      github: 'https://github.com/lohitpt252003',
      linkedin: 'https://www.linkedin.com/in/lohit-talavar-a73926247/',
      photo: 'https://raw.githubusercontent.com/lohitpt252003/DATA/refs/heads/main/data/assets/images/lohit.png',
      contribution: 'Initial setup, backend API development, and database integration'
    },
    {
      name: 'Adarsh Mishra',
      github: 'https://github.com/adarshmishra121',
      linkedin: 'http://linkedin.com/in/adarsh-mishra-461a05269',
      photo: 'https://raw.githubusercontent.com/lohitpt252003/DATA/refs/heads/main/data/assets/images/adarsh.png',
      contribution: 'Frontend UI/UX design and implementation'
    },
    {
      name: 'Priyanshi Meena',
      github: 'https://github.com/MeenaPriyanshi',
      linkedin: 'http://linkedin.com/in/priyanshi-meena-779155335',
      photo: 'https://raw.githubusercontent.com/lohitpt252003/DATA/refs/heads/main/data/assets/images/priyanshi.png',
      contribution: 'judge service preparation, css styling'
    },
    {
      name: 'Sujal Kumar Sahani',
      github: 'https://github.com/contributor4',
      linkedin: 'https://www.linkedin.com/in/contributor4/',
      photo: 'https://via.placeholder.com/100?text=C4',
      contribution: 'Testing, bug fixing, and deployment'
    },
    {
      name: 'Devyani Dubey',
      github: 'https://github.com/devyani345',
      linkedin: 'http://linkedin.com/in/devyani-dubey-756781317',
      photo: 'https://raw.githubusercontent.com/lohitpt252003/DATA/refs/heads/main/data/assets/images/devyani.png',
      contribution: 'css styling'
    },
    {
      name: 'Sumit Choudhary',
      github: 'https://github.com/sumit-610',
      linkedin: 'https://www.linkedin.com/in/sumit-choudhary-433655261',
      photo: 'https://raw.githubusercontent.com/lohitpt252003/DATA/refs/heads/main/data/assets/images/sumit.png',
      contribution: 'css styling'
    },
  ];

  return (
    <div className="credits-container">
      <h2 className="credits-title">Credits</h2>

      <section className="credits-section">
        <h3 className="credits-section-title">Developers</h3>
        <p>This project was primarily developed by Lohit P Talavar/TEAM-ANNA . We are passionate about creating robust and efficient solutions.</p>
        {/* You can add more details about the core development team here */}
      </section>

      <section className="credits-section">
        <h3 className="credits-section-title">Technologies Used:</h3>
        <ul className="credits-tech-list">
          <li><strong>Frontend:</strong> React, JavaScript, HTML/CSS</li>
          <li><strong>Backend:</strong> Flask, Python</li>
          {/* Add more technologies as needed */}
        </ul>
      </section>

      <section className="credits-section">
        <h3 className="credits-section-title">Contributions</h3>
        <div className="credits-contributions-grid">
          {contributions.map((contributor, index) => (
            <div key={index} className="credits-contributor-card">
              <img src={contributor.photo} alt={contributor.name} className="credits-contributor-photo" />
              <h4 className="credits-contributor-name">{contributor.name}</h4>
              <p className="credits-contributor-contribution">{contributor.contribution}</p>
              <div className="credits-contributor-links">
                <a href={contributor.github} target="_blank" rel="noopener noreferrer" className="credits-contributor-link-github">GitHub</a>
                <a href={contributor.linkedin} target="_blank" rel="noopener noreferrer" className="credits-contributor-link-linkedin">LinkedIn</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="credits-section">
        <h3 className="credits-section-title">Special Thanks:</h3>
        <ul className="credits-special-thanks-list">
          <li>To the open-source community for their invaluable libraries and tools.</li>
          <li>To Google Gemini for assistance in development.</li>
          {/* Add more acknowledgments as needed */}
        </ul>
      </section>
    </div>
  );
}

export default Credits;


