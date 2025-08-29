import React from 'react';

function Credits() {
  const contributions = [
    {
      name: 'Lohit K.',
      github: 'https://github.com/lohitk',
      linkedin: 'https://www.linkedin.com/in/lohitk/',
      photo: 'https://via.placeholder.com/100?text=Lohit',
      contribution: 'Initial setup, backend API development, and database integration'
    },
    {
      name: 'Contributor Two',
      github: 'https://github.com/contributor2',
      linkedin: 'https://www.linkedin.com/in/contributor2/',
      photo: 'https://via.placeholder.com/100?text=C2',
      contribution: 'Frontend UI/UX design and implementation'
    },
    {
      name: 'Contributor Three',
      github: 'https://github.com/contributor3',
      linkedin: 'https://www.linkedin.com/in/contributor3/',
      photo: 'https://via.placeholder.com/100?text=C3',
      contribution: 'Problem API development and judge service integration'
    },
    {
      name: 'Contributor Four',
      github: 'https://github.com/contributor4',
      linkedin: 'https://www.linkedin.com/in/contributor4/',
      photo: 'https://via.placeholder.com/100?text=C4',
      contribution: 'Testing, bug fixing, and deployment'
    },
    {
      name: 'Contributor Five',
      github: 'https://github.com/contributor5',
      linkedin: 'https://www.linkedin.com/in/contributor5/',
      photo: 'https://via.placeholder.com/100?text=C5',
      contribution: 'Documentation and project management'
    },
  ];

  return (
    <div className="credits-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Credits</h2>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Developers</h3>
        <p>This project was primarily developed by [Your Name/Team Name]. We are passionate about creating robust and efficient solutions.</p>
        {/* You can add more details about the core development team here */}
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Technologies Used:</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ marginBottom: '5px' }}><strong>Frontend:</strong> React, JavaScript, HTML/CSS</li>
          <li style={{ marginBottom: '5px' }}><strong>Backend:</strong> Flask, Python</li>
          {/* Add more technologies as needed */}
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Contributions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
          {contributions.map((contributor, index) => (
            <div key={index} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <img src={contributor.photo} alt={contributor.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }} />
              <h4 style={{ margin: '10px 0 5px 0' }}>{contributor.name}</h4>
              <p style={{ fontSize: '0.8em', color: '#555', margin: '0 0 10px 0' }}>{contributor.contribution}</p>
              <div style={{ fontSize: '0.9em' }}>
                <a href={contributor.github} target="_blank" rel="noopener noreferrer" style={{ color: '#0366d6', textDecoration: 'none', marginRight: '10px' }}>GitHub</a>
                <a href={contributor.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5', textDecoration: 'none' }}>LinkedIn</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Special Thanks:</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ marginBottom: '5px' }}>To the open-source community for their invaluable libraries and tools.</li>
          <li style={{ marginBottom: '5px' }}>To Google Gemini for assistance in development.</li>
          {/* Add more acknowledgments as needed */}
        </ul>
      </section>
    </div>
  );
}

export default Credits;