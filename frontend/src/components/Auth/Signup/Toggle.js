import React, { useState } from 'react';
import "./toggle.css";

function Toggle(props){
    const [selectedOption, setSelectedOption] = useState('Tourist'); // Default selection

    const handleOptionChange = (event) => {
        const value = event.target.value;
        setSelectedOption(value);
        props.selectedRole(value);
        props.setMessage("");
    };

    return (
        <div className="mydict">
            <div className='mydict'>
                <label className='alllabels'>
                    <input
                        type="radio"
                        name="radio"
                        value="Tourist"
                        checked={selectedOption === 'Tourist'}
                        onChange={handleOptionChange}
                    />
                    <span className='spansignup text-sm block cursor-pointer bg-white px-3 py-1.5 relative ml-0.5 shadow-[0_0_0_1px] shadow-[#b5bfd9] tracking-wide text-[#3e4963] text-center transition-colors duration-500 ease' style={{ fontSize: 13 }}>Tourist</span>
                </label>

                <label className='alllabels'>
                    <input
                        type="radio"
                        name="radio"
                        value="TourGuide"
                        checked={selectedOption === 'TourGuide'}
                        onChange={handleOptionChange}
                    />
                    <span className='spansignup text-sm block cursor-pointer bg-white px-3 py-1.5 relative ml-0.5 shadow-[0_0_0_1px] shadow-[#b5bfd9] tracking-wide text-[#3e4963] text-center transition-colors duration-500 ease' style={{ fontSize: 13 }}>Tour Guide</span>
                </label>

                <label className='alllabels'>
                    <input
                        type="radio"
                        name="radio"
                        value="Advertiser"
                        checked={selectedOption === 'Advertiser'}
                        onChange={handleOptionChange}
                    />
                    <span className='spansignup text-sm block cursor-pointer bg-white px-3 py-1.5 relative ml-0.5 shadow-[0_0_0_1px] shadow-[#b5bfd9] tracking-wide text-[#3e4963] text-center transition-colors duration-500 ease' style={{ fontSize: 13 }}>Advertiser</span>
                </label>

                <label className='alllabels'>
                    <input type="radio"
                        name="radio"
                        value="Seller"
                        checked={selectedOption === 'Seller'}
                        onChange={handleOptionChange}
                        />
                        <span className='spansignup text-sm block cursor-pointer bg-white px-3 py-1.5 relative ml-0.5 shadow-[0_0_0_1px] shadow-[#b5bfd9] tracking-wide text-[#3e4963] text-center transition-colors duration-500 ease' style={{ fontSize: 13 }}>Seller</span>
                </label>
            </div>
        </div>
    );
};

export default Toggle;
