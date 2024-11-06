import React, { useState, useEffect } from "react";
import { Button, Input, Form, Modal, Switch, Spin, notification } from "antd";
import CurrencyDropdown from "./Currency/CurrencyDropdown";
import CurrencyDropdown1 from "./tmp";
import {
  chooseMyCurrency,
  getMyCurrency,
  getProfile,
  updateProfilee,
} from "../../api/profile.ts";
import { Link } from "react-router-dom";
import { set } from "date-fns";
import { redeemPoints } from "../../api/account.ts";
import DeleteAccountButton from "./DeleteAccountButton.js";
import LevelBadge from "./LevelBadge.js";

const TouristProfile = () => {
  const storedUser = localStorage.getItem("user");
  const storedAccessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(false);
  const user = storedUser ? JSON.parse(storedUser) : null;
  const accessToken = storedAccessToken || null;
  const [isEditing, setIsEditing] = useState(false);
  const [currency, setCurrency] = useState(null);
  const [currencyId, setCurrencyId] = useState(null);
  const [rate, setRate] = useState(0);
  const [canRedeem, setCanRedeem] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [level, setLevel] = useState(0);

  const fetchData = async () => {
    setLoading(true); // Show spinner
    try {
      const response = await getProfile(user._id);
      // Assuming response is an array of { code, name, rate }
      setFetchedData(response.data);
      console.log("Fetched Data: ", response.data);
      const extractedLevel = parseInt(response.data.level.replace(/\D/g, ""), 10);
      console.log("Levelllllllllll: ", extractedLevel);
      setLevel(extractedLevel);
      console.log("Level: ", extractedLevel);
      setCanRedeem(response.data.loyalityPoints >= 10000);
      setCurrencyId(response.data.currency);
      const gettingCurrency = await getMyCurrency();
      setCurrency(gettingCurrency.data.code);
      setRate(response.data.rate);
      setLoading(false); // Show spinner
    } catch (error) {
      console.error("Error fetching currencies:", error);
      setLoading(false); // Show spinner
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSaveClick = async () => {
    setLoading(true); // Show spinner

    try {
      const updatedData = {
        ...fetchedData,
        currency: currencyId,
      };
      await updateProfilee(updatedData, user._id);
      const response = await getMyCurrency();
      setFetchedData(updatedData);
      setCurrency(response.data.code);
      setRate(response.data.rate);
      notification.success({ message: "Profile updated successfully!" });
    } catch (error) {
      notification.error({ message: "Failed to update profile." });
    } finally {
      setLoading(false); // Hide spinner
      setIsEditing(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFetchedData((prev) => ({ ...prev, [field]: value }));
  };

  

  const handleRedeemPoints = async () => {
    setLoading(true); // Show spinner

    try {
      const response = await redeemPoints(user._id);
      setCanRedeem(false);
      const updatedData = {
        ...fetchedData,
        loyalityPoints: response.data.remaining,
        wallet: response.data.wallet,
      };
      setFetchedData(updatedData);
      notification.success({ message: "Points redeemed successfully!" });
    } catch (error) {
      notification.error({ message: "Failed to redeem points." });
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <Spin spinning={loading} tip="Updating Profile...">
      <div className="max-w-xl mx-auto p-4 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">{fetchedData.username}</h2>
        <LevelBadge level={level} />
        </div>
        <Form layout="vertical">
          <Form.Item label="Phone Number">
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

          <Form.Item label="Occupation">
            <Input
              value={fetchedData.occupation}
              disabled={!isEditing}
              onChange={(e) => handleInputChange("occupation", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              value={fetchedData.email}
              disabled={!isEditing}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Loyalty Points">
            <Input
              value={fetchedData.loyalityPoints}
              onChange={(e) => handleInputChange("loyalityPoints", e.target.value)}

              disabled
            />
          </Form.Item>

          <>
            {/* Inline styles for the animation */}
            <style>
              {`
          @keyframes slowBounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-4px);
            }
          }
          .slow-bounce {
            animation: slowBounce 3s ease-in-out infinite;
          }
        `}
            </style>

            <div className="flex">
            <Button
              type="primary"
              disabled={!canRedeem}
              onClick={handleRedeemPoints}
              className={`transition ${
                canRedeem
                  ? "bg-yellow-500 hover:bg-yellow-600 shadow-lg slow-bounce" // Slow bounce animation
                  : "bg-gray-300 cursor-not-allowed" // Disabled style
              }`}
            >
              Redeem Points
            </Button>
            <p className="ml-2 mt-1 text-gray-500 text-xs">
              {canRedeem
                ? "You can redeem 10000 points for 100 pounds."
                : "You need at least 10000 points to redeem."}
            </p>
            </div>
          </>

          <div
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
            className="mt-2"
          >
            <Form.Item label="Wallet" style={{ flex: 1 }}>
              <Input
                prefix={currency}
                value={fetchedData.wallet * rate || 0}
                disabled={true}
                onChange={(e) => handleInputChange("wallet", e.target.value)}
              />
            </Form.Item>

            <CurrencyDropdown1
              setCurrencyId={setCurrencyId}
              isEditable={isEditing}
            />
          </div>
        </Form>

        <div className="flex gap-4 mt-4">
          {!isEditing ? (
            <Button type="primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <>
              <Button type="primary" onClick={onSaveClick}>
                Confirm
              </Button>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </>
          )}
          <Link to="/changePassword">
            <Button>Change Password</Button>
          </Link>
          <DeleteAccountButton />
        </div>
      </div>
    </Spin>
  );
};

export default TouristProfile;
