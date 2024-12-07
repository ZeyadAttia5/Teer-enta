import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button, message } from 'antd';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import { resetPassword } from '../../../api/auth.ts';

const ResetPassword = () => {
    const { token } = useParams();
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { search } = useLocation();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await resetPassword({ otp, newPassword, token});
            message.success(response.data.message);
            navigate('/login');
        } catch (error) {
            message.warning('Invalid OTP or an error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <h2 className="text-center text-xl font-semibold mb-4">Reset Your Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Input
                            placeholder="Enter OTP"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            size="large"
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            placeholder="Enter new password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            size="large"
                        />
                    </div>
                    <Button
                        type="danger"
                        htmlType="submit"
                        block
                        loading={loading}
                        size="large"
                        className="bg-blue-950 hover:bg-black text-white"
                    >
                        Reset Password
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
