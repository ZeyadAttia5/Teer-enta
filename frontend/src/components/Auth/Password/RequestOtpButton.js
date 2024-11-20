import React, { useState } from 'react';
import { Input, Button, message } from "antd";

const RequestOtpButton = ({ loading }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Define styles
  const buttonStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: loading ? 'not-allowed' : 'pointer',
    backgroundColor: isHovered ? 'firsy' : '#1e40af', // Hover and default colors
    transition: 'background-color 0.3s ease',
  };

  return (
    <Button
      type="button"
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      loading={loading}
    >
      {loading ? 'Loading...' : 'Request OTP'}
    </Button>
  );
};

export default RequestOtpButton;
