import React, { useState, useEffect } from 'react';

const PermissionGuide = ({ onPermissionGranted }) => {
    const [browserType, setBrowserType] = useState('');

    useEffect(() => {
        // Detect browser type
        if (navigator.userAgent.indexOf("Chrome") !== -1) {
            setBrowserType('chrome');
        } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
            setBrowserType('firefox');
        } else if (navigator.userAgent.indexOf("Safari") !== -1) {
            setBrowserType('safari');
        }
    }, []);

    const getBrowserInstructions = () => {
        switch (browserType) {
            case 'chrome':
                return (
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Click the lock icon 🔒 in the address bar</li>
                        <li>Click "Site settings"</li>
                        <li>Find "Notifications"</li>
                        <li>Change from "Block" to "Allow"</li>
                        <li>Refresh this page</li>
                    </ol>
                );
            case 'firefox':
                return (
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Click the lock icon in the address bar</li>
                        <li>Clear the "Blocked" setting for Notifications</li>
                        <li>Refresh this page</li>
                    </ol>
                );
            case 'safari':
                return (
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Click Safari > Preferences</li>
                        <li>Go to Websites tab</li>
                        <li>Find Notifications in the left sidebar</li>
                        <li>Allow notifications for this website</li>
                        <li>Refresh this page</li>
                    </ol>
                );
            default:
                return (
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Look for notification settings in your browser settings</li>
                        <li>Enable notifications for this website</li>
                        <li>Refresh this page</li>
                    </ol>
                );
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                Notifications are currently blocked
                            </h3>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-3">How to enable notifications:</h2>
                    {getBrowserInstructions()}
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4"
                >
                    I've enabled notifications - Refresh Page
                </button>
            </div>
        </div>
    );
};

export default PermissionGuide;