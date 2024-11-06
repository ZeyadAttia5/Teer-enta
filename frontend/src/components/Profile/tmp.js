import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { getAllCurrencies, chooseMyCurrency } from "../../api/profile.ts";

const { Option } = Select;

const CurrencyDropdown1 = ({ setCurrency }) => {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("EGY");


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
      console.error("Error fetching currencies:", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleChange = async (curr) => {
    setSelectedCurrency(curr);
    setCurrency(curr);
    try {
      const response = await chooseMyCurrency(curr._id);
    } catch (err) {
      console.error("Error choosing currency:", err);
    }
  };

  return (
    <Select onChange={handleChange} style={{ width: 250 }}>
      <Option key={selectedCurrency._id} value={selectedCurrency.code}>
          {selectedCurrency.name}
        </Option>
      {currencies.map((currency) => (
        <Option key={currency._id} value={currency.code}>
          {"("+currency.code+")"+ " "+ currency.name}
        </Option>
      ))}
    </Select>
  );
};

export default CurrencyDropdown1;
