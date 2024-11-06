import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { chooseMyCurrency, getAllCurrencies } from "../../api/profile.ts";

const { Option } = Select;

const CurrencyDropdown1 = ({ setCurrencyId, isEditable }) => {
  const [currencies, setCurrencies] = useState([]);

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

  const handleChange = async (id) => {
    // setSelectedCurrency(curr);
    // setCurrency(curr);
    setCurrencyId(id);
  };

  return (
    <Select onChange={handleChange} style={{ width: 250 }}
      disabled={!isEditable}
      className="mt-1"
    >
      {isEditable &&
        currencies.map((currency) => (
          <Option key={currency._id} value={currency._id}>
            {"(" + currency.code + ")" + " " + currency.name}
          </Option>
        ))}
    </Select>
  );
};

export default CurrencyDropdown1;
