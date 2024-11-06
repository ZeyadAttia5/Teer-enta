import React from 'react';
import { Button, Card, Descriptions, Tag } from 'antd';
import { EditOutlined, LockOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    getMyCurrency,
    getProfile,
    updateProfilee,
  } from "../../api/profile.ts";

const TouristProfile = ({  }) => {

    const tourist = {
        mobileNumber: "123-456-7890",
        nationality: "American",
        dateOfBirth: "1990-01-01",
        occupation: "Job",
        level: "Silver",
        loyaltyPoints: 200,
        isActive: true,
        wallet: 150,
        addresses: ["123 Main St, New York, NY"],
        currency: { code: "USD" },
      };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg mt-8">
      <Card title="Tourist Profile" bordered={false}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Mobile Number">{tourist.mobileNumber}</Descriptions.Item>
          <Descriptions.Item label="Nationality">{tourist.nationality}</Descriptions.Item>
          <Descriptions.Item label="Date of Birth">{new Date(tourist.dateOfBirth).toLocaleDateString()}</Descriptions.Item>
          <Descriptions.Item label="Occupation">{tourist.occupation}</Descriptions.Item>
          <Descriptions.Item label="Level">{tourist.level || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Loyalty Points">{tourist.loyaltyPoints}</Descriptions.Item>
          <Descriptions.Item label="Wallet Balance">{tourist.wallet}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={tourist.isActive ? 'green' : 'red'}>
              {tourist.isActive ? 'Active' : 'Inactive'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Addresses">
            {tourist.addresses.length ? (
              tourist.addresses.map((address, index) => (
                <div key={index} className="mb-1">{address}</div>
              ))
            ) : (
              'No addresses available'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Currency">
            {tourist.currency?.code ?? 'USD'}
          </Descriptions.Item>
        </Descriptions>

        <div className="mt-8 flex justify-center space-x-4">
          <Button type="primary" icon={<EditOutlined />} onClick={() => alert('Edit Profile')}>
            Edit Profile
          </Button>
          <Button type="default" icon={<LockOutlined />} onClick={() => alert('Change Password')}>
            Change Password
          </Button>
          <Button type="danger" icon={<DeleteOutlined />} onClick={() => alert('Delete Account')}>
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TouristProfile;
