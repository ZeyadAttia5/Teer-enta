import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { chooseMyCurrency, getAllCurrencies } from '../../../api/profile.ts';

const customStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: '#ccc',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#888',
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#888',
  }),
};

const CurrencyDropdown = ({setCurrency}) => {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const storedUser = localStorage.getItem("user");
  const storedAccessToken = localStorage.getItem("accessToken");

  // Parse the user object
  const user = storedUser ? JSON.parse(storedUser) : null;
  const accessToken = storedAccessToken || null;

  const fetchCurrencies = async () => {
    try {
      const response = await getAllCurrencies();
      // Assuming response is an array of { code, name, rate }
      const formattedCurrencies = response.data.map((currency) => ({
        ...currency, // Spread to include name, code, rate
        value: currency.code,
        label: `${currency.name} (${currency.code})`,
      }));
      setCurrencies(formattedCurrencies);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleCurrencyChange = async (curr) => {
    setSelectedCurrency(curr);
    setCurrency(curr);
    try{
      
      const response = await chooseMyCurrency(curr._id);

    }catch(err){
      console.error('Error choosing currency:', err);
    }
  };

  return (
    <div style={{ width: '100%', margin: 'auto' }}>
      <Select
        options={currencies}
        value={selectedCurrency}
        onChange={handleCurrencyChange}
        isSearchable={true}
        placeholder="Select a currency"
        styles={customStyles}
      />
    </div>
  );
};

export default CurrencyDropdown;
