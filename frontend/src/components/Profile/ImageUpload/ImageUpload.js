import { useState } from 'react';
import axios from 'axios';

function ImageUpload({setProfileImage}) {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        setProfileImage(e.target.files[0]);
    };

    

    return (
        <form>
            <input type="file" onChange={handleImageChange} />
            
        </form>
    );
}

export default ImageUpload;
