import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button, message } from 'antd';
import {forgotPassword} from "../../../api/auth.ts";
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await forgotPassword({ email });
            message.success(response.data.message);
            navigate('/reset-password/'+response.data.token);

        } catch (error) {
            message.warning('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center bg-fourth">
            <div className="bg-white p-8 rounded shadow-lg w-96 mt-16">
                <h2 className="text-center text-xl font-semibold mb-4">Forgot Your Password?</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Input
                            placeholder="Enter your email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        className="bg-blue-950 text-white hover:bg-black"
                    >
                        Request OTP
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
