import React from 'react';
import { CopyOutlined, MailOutlined } from '@ant-design/icons';
import { message, Button } from 'antd';

const ShareButtons = ({ shareLink }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    message.success("Link copied to clipboard!");
  };

  const handleShareViaMail = () => {
    window.location.href = `mailto:?subject=Check this out&body=${shareLink}`;
  };

  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Button 
        type="primary" 
        icon={<CopyOutlined />} 
        onClick={handleCopyLink}
      >
        Copy Link
      </Button>
      <Button 
        type="primary" 
        icon={<MailOutlined />} 
        onClick={handleShareViaMail}
      >
        Share via Email
      </Button>
    </div>
  );
};

export default ShareButtons;

