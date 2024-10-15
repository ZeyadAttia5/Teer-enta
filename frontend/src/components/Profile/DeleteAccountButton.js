import React from 'react';
import { requestAccountDeletion } from '../../api/account.ts';

const DeleteAccountButton = () => {
    const handleDelete = async () => {
        const response = await requestAccountDeletion();
        console.log(response);
    };

    return (
        <div>
            <h2>Delete Account</h2>
            <button onClick={handleDelete}>Delete My Account</button>
        </div>
    );
};

export default DeleteAccountButton;