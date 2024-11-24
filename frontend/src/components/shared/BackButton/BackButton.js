import React from 'react';

const BackButton = () => {
    return (
        <button
            className="mb-4 text-second hover:underline"
            onClick={() => window.history.back()}
        >
            <span className="text-2xl">←</span> Go back
        </button>
    );
};

export default BackButton;