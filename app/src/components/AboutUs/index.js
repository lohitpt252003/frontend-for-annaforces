import React from 'react';
import './index.css';

function AboutUs() {
  return (
    <div className="about-us-container">
      <h2 className="about-us-title">About Annaforces</h2>
      <p className="about-us-content">
        Annaforces is a competitive programming platform designed to help you hone your coding skills.
        We provide a wide range of problems, from easy to challenging, to cater to all skill levels.
        Our goal is to create a vibrant community where programmers can learn, compete, and grow.
      </p>
      <p className="about-us-content">
        Our platform features a robust judging system, real-time feedback on submissions,
        and a user-friendly interface. Whether you are a beginner or an experienced competitive programmer,
        Annaforces offers the tools and environment you need to succeed.
      </p>
      <p className="about-us-content">
        Join us today and start your journey to becoming a coding master!
      </p>
    </div>
  );
}

export default AboutUs;