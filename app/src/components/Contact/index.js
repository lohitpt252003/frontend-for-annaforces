import React from 'react';
import './index.css';

function Contact() {
  return (
    <div className="contact-container">
      <h2 className="contact-title">Contact Us</h2>
      <p className="contact-content">
        If you have any questions, feedback, or inquiries, please feel free to reach out to us.
        We are here to help!
      </p>
      <div className="contact-details">
        <p><strong>Email:</strong> support@annaforces.com</p>
        <p><strong>Phone:</strong> +1 (123) 456-7890</p>
        <p><strong>Address:</strong> 123 Coding Lane, Algorithm City, CodeLand</p>
      </div>
      <p className="contact-content">
        You can also fill out the contact form below, and we will get back to you as soon as possible.
      </p>
      {/* You can add a contact form here if needed */}
    </div>
  );
}

export default Contact;