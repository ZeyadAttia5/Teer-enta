import React, { useEffect, useState } from "react";

import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  message,
  Steps,
  List,
  Card,
  Typography,
  Tag,
  Space,
  Row,
  Col,
  Divider,
  Spin,
} from "antd";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  EuroOutlined,
  SearchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { bookHotel, getHotels } from "../../api/hotels.ts";
import AutoComplete from "react-google-autocomplete";

const { Text, Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const HotelOfferCard = ({ offer,setLoading }) => {
  const { hotel, offers } = offer;
  const mainOffer = offers[0];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const book = async () => {
    setLoading(true);
    try {
        const payments= [
        {
            "method": "creditCard",
            "card": {
                "vendorCode": "VI",
                "cardNumber": "4111111111111111",
                "expiryDate": "2024-10",
                "holderName": "John Doe"
            }
        }
    ]
      let { data } = await bookHotel({
        hotel: hotel,
        offer: mainOffer,
        guests: mainOffer.guests,
        payments
      });
      console.log("Hotel booked:", data);
        message.success("Hotel booked successfully!");
    } catch (error) {
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      hoverable
      style={{ width: "100%", marginBottom: 16 }}
      onClick={() => console.log("Selected offer:", mainOffer.id)}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {/* Header Section */}
        <Row justify="space-between" align="top">
          <Col>
            <Title level={4} style={{ marginBottom: 8 }}>
              {hotel.name}
            </Title>
            <Space>
              <EnvironmentOutlined style={{ color: "#666" }} />
              <Text type="secondary">{hotel.cityCode}</Text>
            </Space>
          </Col>
          <Col>
            <Tag
              color={
                mainOffer.policies.paymentType === "deposit" ? "blue" : "green"
              }
            >
              {mainOffer.policies.paymentType}
            </Tag>
          </Col>
        </Row>

        {/* Dates Section */}
        <Row gutter={24}>
          <Col span={12}>
            <Space direction="vertical" size="small">
              <Space>
                <CalendarOutlined style={{ color: "#666" }} />
                <Text type="secondary">Check-in</Text>
              </Space>
              <Text strong>{formatDate(mainOffer.checkInDate)}</Text>
            </Space>
          </Col>
          <Col span={12}>
            <Space direction="vertical" size="small">
              <Space>
                <CalendarOutlined style={{ color: "#666" }} />
                <Text type="secondary">Check-out</Text>
              </Space>
              <Text strong>{formatDate(mainOffer.checkOutDate)}</Text>
            </Space>
          </Col>
        </Row>

        {/* Guests Section */}
        <Space>
          <UserOutlined style={{ color: "#666" }} />
          <Text type="secondary">{mainOffer.guests.adults} Adults</Text>
        </Space>

        <Divider style={{ margin: "12px 0" }} />

        {/* Price and Room Section */}
        <Row justify="space-between" align="bottom">
          {mainOffer.room?.typeEstimated && (
            <Col>
              <Text type="secondary">Room Type</Text>
              <br />
              <Text strong>{mainOffer.room?.typeEstimated.bedType} Bed</Text>
            </Col>
          )}
          <Col>
            <Text type="secondary">Total Price</Text>
            <br />
            <Space>
              <EuroOutlined />
              <Text strong style={{ fontSize: 20 }}>
                {parseFloat(mainOffer.price.total).toLocaleString()}
              </Text>
            </Space>
          </Col>
        </Row>

        {/* Cancellation Policy */}
        {(mainOffer.policies.cancellations && mainOffer.policies.cancellations[0]?.description) && (
          <Text type="danger" style={{ fontSize: 12 }}>
            {mainOffer.policies.cancellations[0]?.description?.text}
          </Text>
        )}

        {/* Action Button */}
        <Button
          type="primary"
          block
          onClick={(e) => {
            // e.stopPropagation();
            book();
          }}
        >
          Book
        </Button>
      </Space>
    </Card>
  );
};

const ListOffers = ({ hotelOffers,setLoading }) => {
  const [searchText, setSearchText] = React.useState("");
  const [filteredOffers, setFilteredOffers] = useState(hotelOffers);

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = hotelOffers.filter(
      (offer) =>
        offer.hotel.name.toLowerCase().includes(value.toLowerCase()) ||
        offer.hotel.cityCode.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOffers(filtered);
  };

  return (
    <div style={{ padding: "24px" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Hotel Offers</Title>
        </Col>
        <Col span={8}>
          <Search
            placeholder="Search hotels by name or city"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onChange={(e) => handleSearch(e.target.value)}
            value={searchText}
          />
        </Col>
      </Row>

      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 3,
        }}
        dataSource={filteredOffers}
        renderItem={(offer) => (
          <List.Item>
            <HotelOfferCard offer={offer} setLoading={setLoading}/>
          </List.Item>
        )}
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 6,
          position: "bottom",
          align: "center",
        }}
      />
    </div>
  );
};

const HotelSearchForm = ({ setOffers, setLoading, onFinish: finishProp }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    const formattedValues = {
      ...values,
      checkInDate: values.dates[0].format("YYYY-MM-DD"),
      checkOutDate: values.dates[1].format("YYYY-MM-DD"),
    };
    delete formattedValues.dates;

    console.log("Search criteria:", formattedValues);
    try {
      let { data } = await getHotels(formattedValues);
      setOffers(data);
    } catch (error) {
      message.error("Error searching for hotels. Please try again later.");
    } finally {
      setLoading(false);
      finishProp();
    }
  };

  return (
    <Card style={{ maxWidth: 600, margin: "24px auto" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          adults: 2,
          city: "New York",
        }}
      >
        <Form.Item
          name="city"
          label="City"
          rules={[{ required: true, message: "Please enter a city" }]}
        >
          <AutoComplete
            className="w-full border shadow-sm p-2 rounded"
            apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            onPlaceSelected={(place) => {
             console.log("Place selected:", !place);
             if (!place?.address_components)
               return message.error("Invalid city selected");
              let destinationCity = place?.address_components[0].long_name;

              form.setFieldsValue({
                city: destinationCity,
              });
            }}
            value={form.getFieldValue("city")}
          />
        </Form.Item>

        <Form.Item
          name="dates"
          label="Check-in and Check-out Dates"
          rules={[{ required: true, message: "Please select your dates" }]}
        >
          <RangePicker
            style={{ width: "100%" }}
            size="large"
            format="YYYY-MM-DD"
            placeholder={["Check-in", "Check-out"]}
          />
        </Form.Item>

        <Form.Item
          name="adults"
          label="Number of Adults"
          rules={[
            { required: true, message: "Please enter number of adults" },
            { type: "number", min: 1, message: "Must be at least 1 adult" },
          ]}
        >
          <InputNumber
            min={1}
            max={10}
            style={{ width: "100%" }}
            size="large"
            prefix={<UserOutlined />}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            icon={<SearchOutlined />}
          >
            Search Hotels
          </Button>
        </Form.Item>
      </Form>

      <Space direction="vertical" style={{ width: "100%", marginTop: 16 }}>
        <Button block onClick={() => form.resetFields()}>
          Reset Form
        </Button>
      </Space>
    </Card>
  );
};

const BookHotel = () => {
  const [step, setStep] = useState(0);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const steps = [
    {
      title: "Choose City and Dates",
      content: (
        <HotelSearchForm
          setOffers={setOffers}
          setLoading={setLoading}
          onFinish={() => setStep(step + 1)}
        />
      ),
    },
    {
      title: "Hotel Offers",
      content: <ListOffers hotelOffers={offers} setLoading={setLoading} />,
    },
  ];
  return (
    <Card className="w-11/12 my-20 mx-auto shadow">
      <Title level={4} className="mb-6">
        Book Your Hotel
      </Title>
      <Steps current={step} items={steps} className="mb-8" />
      {loading ? (
        <div className="flex justify-center p-8">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : (
        steps[step].content
      )}
      <div className="flex justify-between mt-8">
        {step > 0 && (
          <Button onClick={() => setStep(step - 1)}>Previous</Button>
        )}
        {step < steps.length - 1 && (
          <Button type="primary" onClick={() => setStep(step + 1)}>
            Next
          </Button>
        )}
        {step === steps.length - 1 && (
          <Button type="primary">Complete Booking</Button>
        )}
      </div>
      {/* </Form> */}
    </Card>
  );
};

export default BookHotel;
