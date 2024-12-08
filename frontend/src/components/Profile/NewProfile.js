import React, {useState, useEffect} from "react";
import {Button,message , Input, Form, Modal, Switch, Spin, notification} from "antd";
import CurrencyDropdown from "./Currency/CurrencyDropdown";
import CurrencyDropdown1 from "./ProfileComponents/tmp";
import {
    chooseMyCurrency, getMyCurrency, getProfile, updateProfilee,
} from "../../api/profile.ts";
import {Link} from "react-router-dom";
import {set} from "date-fns";
import {redeemPoints} from "../../api/account.ts";
import DeleteAccountButton from "./ProfileComponents/DeleteAccountButton.js";
import LevelBadge from "./ProfileComponents/LevelBadge.js";
import WalletBalanceCard from "./ProfileComponents/WalletBalanceCard.js";
import UserCard from "./ProfileComponents/UserCard.js";

const TouristProfile = () => {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("accessToken");
    const [loading, setLoading] = useState(false);
    const user = storedUser ? JSON.parse(storedUser) : null;
    const accessToken = storedAccessToken || null;
    const [isEditing, setIsEditing] = useState(false);
    const [currency, setCurrency] = useState("");
    const [currencyId, setCurrencyId] = useState("");
    const [rate, setRate] = useState(0);
    const [canRedeem, setCanRedeem] = useState(false);
    const [fetchedData, setFetchedData] = useState([]);
    const [level, setLevel] = useState(0);
    const [wallet, setWallet] = useState(0);
    const [points, setPoints] = useState(0);

    const fetchData = async () => {
        setLoading(true); // Show spinner
        try {
            const response = await getProfile(user._id);
            // Assuming response is an array of { code, name, rate }
            setFetchedData(response.data);
            setPoints(response.data.loyalityPoints);
            setWallet(response.data.wallet);
            console.log("Fetched Data: ", response.data);
            const extractedLevel = parseInt(response.data.level.replace(/\D/g, ""), 10);
            console.log("Levelllllllllll: ", extractedLevel);
            setLevel(extractedLevel);
            console.log("Level: ", extractedLevel);
            setCanRedeem(response.data.loyalityPoints >= 10000);
            setCurrencyId(response.data.currency);
            const gettingCurrency = await getMyCurrency();
            setCurrency(gettingCurrency.data.code);
            setRate(gettingCurrency.data.rate);
            console.log("rate: ", gettingCurrency.data.rate);
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
                ...fetchedData, currency: currencyId,
            };
            await updateProfilee(updatedData, user._id);
            const response = await getMyCurrency();
            setFetchedData(updatedData);
            setCurrency(response.data.code);
            setRate(response.data.rate);
            message.success("Profile updated successfully!");
        } catch (error) {
            message.warning(error.response.data.message);
        } finally {
            setLoading(false); // Hide spinner
            setIsEditing(false);
        }
        window.location.reload();
    };

    const handleInputChange = (field, value) => {
        setFetchedData((prev) => ({...prev, [field]: value}));
    };

    const handleRedeemPoints = async () => {
        setLoading(true); // Show spinner

        try {
            const response = await redeemPoints(user._id);
            setCanRedeem(false);
            const updatedData = {
                ...fetchedData, loyalityPoints: response.data.remaining, wallet: response.data.wallet,
            };
            setFetchedData(updatedData);
            setPoints(response.data.remaining);
            setWallet(response.data.wallet);
            message.success("Points redeemed successfully!");
        } catch (error) {
            message.warning(error.response.data.message);
        } finally {
            setLoading(false); // Hide spinner
        }
    };

    return (<Spin spinning={loading} tip="Updating Profile...">
        <div className="flex w-full ml-16">
            <div className="flex w-full">
                <div className="flex flex-col">
                    <UserCard
                        username={user.username}
                        wallet={fetchedData.wallet}
                        currency={currency}
                        points={fetchedData.loyalityPoints}
                        userRole={fetchedData.userRole}
                        rate={rate}
                        setCurrencyId={setCurrencyId}
                        isEditable={isEditing}
                        level={level}
                    />
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="flex flex-col gap-2">
                            {!isEditing && (<Button
                                type="danger"
                                className="hover:bg-third px-14 py-6 bg-fourth"
                                onClick={() => setIsEditing(true)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="size-5"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                    />
                                </svg>
                                {" "}
                                Edit Profile
                            </Button>)}
                            <Link to="/changePassword">
                                <Button
                                    type="danger"
                                    className="hover:bg-third px-14 w-full py-6 bg-fourth"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="size-5"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                        />
                                    </svg>
                                    {" "}
                                    Change Password
                                </Button>
                            </Link>
                            <DeleteAccountButton/>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center m-8 w-2/3">
                    <div className="max-w-xl p-4 bg-white shadow-lg border-gray-300 w-full rounded-lg">
                        <div className="flex justify-between w-fit"></div>
                        <Form layout="vertical" className="">
                            <Form.Item label="Phone Number">
                                <Input
                                    value={fetchedData.mobileNumber}
                                    disabled={!isEditing}
                                    onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
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
                            {/* <Form.Item label="Loyalty Points">
                <Input
                  value={fetchedData.loyalityPoints}
                  onChange={(e) =>
                    handleInputChange("loyalityPoints", e.target.value)
                  }
                  disabled
                />
              </Form.Item> */}

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

                                <div className="flex pb-3">
                                    <Button
                                        type="primary"
                                        disabled={!canRedeem}
                                        onClick={handleRedeemPoints}
                                        className={`transition ${canRedeem ? "bg-yellow-500 hover:bg-yellow-600 shadow-lg slow-bounce" // Slow bounce animation
                                            : "bg-gray-300 cursor-not-allowed" // Disabled style
                                        }`}
                                    >
                                        Redeem Points
                                    </Button>
                                    <p className="ml-2 mt-1 text-gray-500 text-xs">
                                        {canRedeem ? "You can redeem 10000 points for 100 pounds." : "You need at least 10000 points to redeem."}
                                    </p>
                                </div>
                            </>
                            <div className="">
                                <Form.Item label="Currency">
                                    <div>
                                        <CurrencyDropdown1
                                            setCurrencyId={setCurrencyId}
                                            isEditable={isEditing}
                                        />
                                    </div>
                                </Form.Item>
                            </div>

                        </Form>

                        {isEditing && (<div className="flex gap-3 justify-between mt-4">
                            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button
                                type="danger"
                                onClick={onSaveClick}
                                className="bg-fourth border-gray-500 text-black hover:bg-third"
                            >
                                Confirm
                            </Button>
                        </div>)}
                    </div>
                </div>
            </div>
        </div>
    </Spin>);
};

export default TouristProfile;
