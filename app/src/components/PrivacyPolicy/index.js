import React from 'react';
import './index.css';

function PrivacyPolicy() {
  return (
    <div className="privacy-policy-container">
      <h2 className="privacy-policy-title">Privacy Policy</h2>
      <p className="privacy-policy-content">
        This Privacy Policy describes how Annaforces collects, uses, and discloses your Personal Information when you visit or make a purchase from the Site.
      </p>

      <h3>Collection of Personal Information</h3>
      <p className="privacy-policy-content">
        When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.
      </p>

      <h3>Use of Personal Information</h3>
      <p className="privacy-policy-content">
        We use your personal information to provide our services to you, which includes: offering products for sale, processing payments, shipping and fulfillment of your order, and keeping you up to date on new products, services, and offers.
      </p>

      <h3>Sharing Personal Information</h3>
      <p className="privacy-policy-content">
        We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you, as described above. For example, we use Firebase for user authentication and data storage.
      </p>

      <h3>Your Rights</h3>
      <p className="privacy-policy-content">
        If you are a resident of the EEA, you have the right to access Personal Information we hold about you and to ask that your Personal Information be corrected, updated, or erased. If you would like to exercise this right, please contact us through the contact information below.
      </p>

      <h3>Changes</h3>
      <p className="privacy-policy-content">
        We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.
      </p>

      <h3>Contact</h3>
      <p className="privacy-policy-content">
        For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at support@annaforces.com.
      </p>
    </div>
  );
}

export default PrivacyPolicy;