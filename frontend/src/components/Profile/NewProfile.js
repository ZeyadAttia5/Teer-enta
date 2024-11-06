import React, { useState, useEffect } from "react";
import { Button, Input, Form, Modal, Switch, Spin, notification } from "antd";
import CurrencyDropdown from "./Currency/CurrencyDropdown";
import CurrencyDropdown1 from "./tmp";
import { getProfile, updateProfilee } from "../../api/profile.ts";

const TouristProfile = () => {
  const storedUser = localStorage.getItem("user");
  const storedAccessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(false);
  const user = storedUser ? JSON.parse(storedUser) : null;
  const accessToken = storedAccessToken || null;

  const [fetchedData, setFetchedData] = useState([]);

  const fetchData = async () => {
    setLoading(true); // Show spinner
    try {
      const response = await getProfile(user._id);
      // Assuming response is an array of { code, name, rate }
      setFetchedData(response.data);
      setLoading(false); // Show spinner
    } catch (error) {
      console.error("Error fetching currencies:", error);
      setLoading(false); // Show spinner
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [currency, setCurrency] = useState("JOD");

  const [profileData, setProfileData] = useState({});
  const onEditClick = () => setIsEditing(true);

  const onSaveClick = async () => {
    setLoading(true); // Show spinner
    try {
      await updateProfilee({
        ...fetchedData
      }, user._id);
      notification.success({ message: "Profile updated successfully!" });
    } catch (error) {
      notification.error({ message: "Failed to update profile." });
    } finally {
      setLoading(false); // Hide spinner
      setIsEditing(false);
    }
  };

  const onCancelEdit = () => setIsEditing(false);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: "Are you sure you want to delete your account?",
      // onOk: deleteAccount,
    });
  };

  return (
    <Spin spinning={loading} tip="Updating Profile...">
      <div className="max-w-xl mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Tourist Profile</h2>
        <Form layout="vertical">
          <Form.Item label="Mobile Number">
            <Input
              value={fetchedData.mobileNumber}
              disabled={!isEditing}
              onChange={(e) =>
                handleInputChange("mobileNumber", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item label="Nationality">
            <Input
              value={fetchedData.nationality}
              disabled={!isEditing}
              onChange={(e) => handleInputChange("nationality", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Date of Birth">
            <Input
              type="date"
              value={fetchedData.dateOfBirth?.substring(0, 10)}
              disabled={!isEditing}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Occupation">
            <Input
              value={fetchedData.occupation}
              disabled={!isEditing}
              onChange={(e) => handleInputChange("occupation", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Loyalty Points">
            <Input value={fetchedData.loyalityPoints} disabled />
          </Form.Item>
          <Form.Item label="Wallet">
            <Input
              prefix={currency}
              value={fetchedData.wallet}
              disabled={!isEditing}
              onChange={(e) => handleInputChange("wallet", e.target.value)}
            />
          </Form.Item>
          <CurrencyDropdown1 setCurrency={setCurrency} />
          <Form.Item label="Active Status">
            <Switch
              checked={fetchedData.isActive}
              disabled={!isEditing}
              onChange={(checked) => handleInputChange("isActive", checked)}
            />
          </Form.Item>
        </Form>

        <div className="flex gap-4 mt-4">
          {!isEditing ? (
            <Button type="primary" onClick={onEditClick}>
              Edit Profile
            </Button>
          ) : (
            <>
              <Button type="primary" onClick={onSaveClick}>
                Confirm
              </Button>
              <Button onClick={onCancelEdit}>Cancel</Button>
            </>
          )}
          <Button
          //  onClick={changePassword}
          >
            Change Password
          </Button>
          <Button type="danger" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </div>
      </div>
    </Spin>
  );
};

export default TouristProfile;
