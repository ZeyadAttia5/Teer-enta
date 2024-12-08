import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { getAllCurrencies, getMyCurrency } from "../../../api/profile.ts";

const { Option } = Select;

const CurrencyDropdown1 = ({ setCurrencyId, isEditable }) => {
  const [currencies, setCurrencies] = useState([]);
  const [myCurrency, setMyCurrency] = useState(null);

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
  const fetchMyCurrency = async () => {
    try {
      const response = await getMyCurrency();
      // Assuming response is an array of { code, name, rate }
      const formattedCurrency = response.data;
      console.log("my formattedCurrency", formattedCurrency);
      setMyCurrency(formattedCurrency);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  useEffect(() => {
    fetchMyCurrency();
  }, []);

  const handleChange = async (currency) => {
    // setSelectedCurrency(curr);
    // setCurrency(curr);
    // setCurrencyId(currency.id);
    // setMyCurrency(currency.code);
    setCurrencyId(currency);
    const selectedCurrency = currencies.find((cur) => cur._id === currency);
    setMyCurrency(selectedCurrency);
  };

  return (
    <Select
      onChange={handleChange}
      style={{ width: "100%" }}
      disabled={!isEditable}
      className="mt-1"
      placeholder={
        myCurrency
          ? ` ${myCurrency.code}${
              isEditable ? " - Change your currency from here" : ""
            }`
          : "Select your currency"
      }
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
