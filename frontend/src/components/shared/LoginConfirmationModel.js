import React from 'react';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LoginOutlined } from "@ant-design/icons";
import {LogInIcon} from "lucide-react";

const LoginConfirmationModal = ({
                                    title = 'Login Required',
                                    content = 'Please login to continue.',
                                    okText = 'Login',
                                    cancelText = 'Cancel',
                                    onCancel,
                                    redirectPath = `${window.location.origin}/login`,
                                    open,
                                    setOpen,
                                    width = 400
                                }) => {
    const navigate = useNavigate();

    const handleOk = () => {
        setOpen(false);
        navigate(redirectPath);
    };

    const handleCancel = () => {
        setOpen(false);
        if (onCancel) onCancel();
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <LogInIcon className="text-blue-950" />
                    <span className="text-blue-900 font-semibold text-xl">{title}</span>
                </div>
            }
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={okText}
            cancelText={cancelText}
            className="top-1/3"
            width={width}
            okButtonProps={{
                type: 'danger',
                className: 'bg-blue-950  text-white hover:bg-black'
            }}
            cancelButtonProps={{
                type: 'danger',
                className: 'border-gray-200 text-gray-600 hover:text-red-500'
            }}
            maskStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(4px)'
            }}
            styles={{
                body: {
                    padding: '20px 0',
                }
            }}
        >
            <div className="text-gray-600 text-lg">
                {content}
            </div>
        </Modal>
    );
};

export default LoginConfirmationModal;