import React, { useState, useEffect } from "react";
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
  HomeOutlined,
  SolutionOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { bookHotel, getHotels } from "../../api/hotels.ts";
import AutoComplete from "react-google-autocomplete";
import BookingPayment from "../shared/BookingPayment.jsx";

const { Text, Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const CustomProgressBar = ({ step, setStep }) => {
  const steps = [
    { label: "Choose City and Dates ", icon: <SolutionOutlined /> },
    { label: "Hotel Offers ", icon: <HomeOutlined /> },
    { label: "Payment ", icon: <CreditCardOutlined /> },
  ];
  const colors = ["#1a2b49", "#526D82", "#9DB2BF", "#DDE6ED"];
  const textColors = ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#686d7e"];

  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((item, index) => (
        <div
          key={index}
          className={`flex-1 text-center ${
            index <= step ? "cursor-pointer" : "cursor-default"
          }`}
          onClick={() => {
            if (index <= step) setStep(index);
          }}
        >
          <div
            className={`py-2 px-4 rounded-full transition-all duration-300`}
            style={{
              backgroundColor:
                index < step
                  ? colors[0]
                  : index === step
                  ? colors[1]
                  : colors[3],
              color:
                index < step
                  ? textColors[0]
                  : index === step
                  ? textColors[1]
                  : textColors[3],
              transform: step === index ? "scale(1)" : "scale(1)",
            }}
          >
            {item.label}
            <Space>{item.icon}</Space>
          </div>
        </div>
      ))}
    </div>
  );
};

const HotelOfferCard = ({ offer, setOffer, setStep }) => {
  const { hotel, offers } = offer;
  const mainOffer = offers[0];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const bookOffer = async () => {
    const payments = [
      {
        method: "creditCard",
        card: {
          vendorCode: "VI",
          cardNumber: "4111111111111111",
          expiryDate: "2024-10",
          holderName: "John Doe",
        },
      },
    ];
    setOffer({
      hotel: hotel,
      offer: mainOffer,
      guests: mainOffer.guests,
      payments,
    });
    setStep(2);
  };

  return (
    <Card
      hoverable
      className="w-3/4 mb-4 p-4 bg-white shadow-lg h-[500px] relative"
      classNames={{ body: "h-full relative" }}
      onClick={() => console.log("Selected offer:", mainOffer?.id)}
    >
      <Space
        direction="vertical"
        size="middle"
        className="w-full h-full  "
        classNames={{ item: "h-full" }}
      >
        <Row justify="space-between" align="top">
          <Col>
            <Title level={4} className="mb-2 text-[#1a2b49]">
              {hotel?.name}
            </Title>
            <Space>
              <EnvironmentOutlined className="text-[#666]" />
              <Text type="secondary">{hotel?.cityCode}</Text>
            </Space>
          </Col>
          <Col>
            <Tag
              color={
                mainOffer?.policies?.paymentType === "deposit"
                  ? "blue"
                  : "green"
              }
            >
              {mainOffer?.policies?.paymentType}
            </Tag>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Space direction="vertical" size="small">
              <Space>
                <CalendarOutlined className="text-[#666]" />
                <Text type="secondary">Check-in</Text>
              </Space>
              <Text strong>{formatDate(mainOffer?.checkInDate)}</Text>
            </Space>
          </Col>
          <Col span={12}>
            <Space direction="vertical" size="small">
              <Space>
                <CalendarOutlined className="text-[#666]" />
                <Text type="secondary">Check-out</Text>
              </Space>
              <Text strong>{formatDate(mainOffer?.checkOutDate)}</Text>
            </Space>
          </Col>
        </Row>

        <Space>
          <UserOutlined className="text-[#666]" />
          <Text type="secondary">{mainOffer?.guests?.adults} Adults</Text>
        </Space>

        <Divider className="my-3" />

        <Row justify="space-between" align="bottom">
          {mainOffer?.room?.typeEstimated && (
            <Col>
              <Text type="secondary">Room Type</Text>
              <br />
              <Text strong>{mainOffer?.room?.typeEstimated?.bedType} Bed</Text>
            </Col>
          )}
          <Col>
            <Text type="secondary">Total Price</Text>
            <br />
            <Space>
              <EuroOutlined />
              <Text strong className="text-2xl">
                {parseFloat(mainOffer?.price?.total).toLocaleString()}
              </Text>
            </Space>
          </Col>
        </Row>
        <Col
          style={{
            padding: 0,
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
          }}
        >
          {mainOffer?.policies?.cancellations &&
            mainOffer?.policies?.cancellations[0]?.description && (
              <Text type="danger" className="text-xs">
                {mainOffer?.policies?.cancellations[0]?.description?.text}
              </Text>
            )}

          <Button
            type="danger"
            block
            className="bg-[#1a2b49] border-[#1a2b49] text-white hover:bg-[#526D82] hover:border-[#526D82]"
            onClick={() => {
              bookOffer();
            }}
          >
            Book
          </Button>
        </Col>
      </Space>
    </Card>
  );
};

const ListOffers = ({ hotelOffers, setLoading, setOffer, setStep }) => {
  const [searchText, setSearchText] = React.useState("");
  const [filteredOffers, setFilteredOffers] = useState(hotelOffers);

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = hotelOffers?.filter(
      (offer) =>
        offer.hotel.name.toLowerCase().includes(value.toLowerCase()) ||
        offer.hotel.cityCode.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOffers(filtered);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1a2b49]">Hotel Offers</h2>
        <div className="w-1/3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search hotels by name or city"
              className="w-full py-2 px-4 border border-[#9DB2BF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#526D82]"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <SearchOutlined className="absolute right-3 top-3 text-[#526D82]" />
          </div>
        </div>
      </div>

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
            <HotelOfferCard
              offer={offer}
              setLoading={setLoading}
              setOffer={setOffer}
              setStep={setStep}
            />
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

  const disabledDate = (current) => {
    return current && current < new Date().setHours(0, 0, 0, 0);
  };

  return (
    <Card className="max-w-xl mx-auto my-6 p-6 bg-[#DDE6ED]">
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
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value.length !== 2) {
                  return Promise.reject(new Error("Please select your dates"));
                }
                const [start, end] = value;
                if (start.isBefore(new Date().setHours(0, 0, 0, 0))) {
                  return Promise.reject(
                    new Error("Start date cannot be in the past")
                  );
                }
                if (end.isSame(start)) {
                  return Promise.reject(
                    new Error("End date cannot be the same as start date")
                  );
                }
                if (end.isBefore(start)) {
                  return Promise.reject(
                    new Error("End date cannot be before start date")
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <RangePicker
            className="w-full"
            size="large"
            format="YYYY-MM-DD"
            placeholder={["Check-in", "Check-out"]}
            disabledDate={disabledDate}
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
            className="w-full"
            size="large"
            prefix={<UserOutlined />}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="danger"
            htmlType="submit"
            block
            size="large"
            className="bg-[#1a2b49] border-[#1a2b49] hover:bg-[#526D82] hover:border-[#526D82] text-white"
            icon={<SearchOutlined />}
          >
            Search Hotels
          </Button>
        </Form.Item>
      </Form>

      <Space direction="vertical" className="w-full mt-4">
        <Button
          block
          onClick={() => form.resetFields()}
          className="bg-[#9DB2BF] border-[#9DB2BF] hover:bg-[#686d7e] hover:border-[#686d7e] text-white"
        >
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
  const [offer, setOffer] = useState(null);
  const [promoCode, setPromoCode] = useState(null);

  const book = async () => {
    setLoading(true);
    try {
      const user = localStorage.getItem("user");
      if (user) {
        let { data } = await bookHotel({ ...offer, promoCode });
        console.log("Hotel booked:", data);
        message.success("Hotel booked successfully!");
      } else {
        message.error("You need to login first");
      }
      setStep(0);
    } catch (error) {
      console.log("Error booking hotel:", error);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
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
      content: (
        <ListOffers
          hotelOffers={offers}
          setLoading={setLoading}
          setOffer={setOffer}
          setStep={setStep}
        />
      ),
    },
    {
      title: "Payment",
      content: (
        <BookingPayment
          onBookingClick={book}
          isloading={loading}
          amount={offer && offer.offer.price.total}
          setPromoCode={setPromoCode}
        />
      ),
    },
  ];
  return (
    <Card className="w-4/5 my-5 mx-auto p-6 bg-[#f9f9f9] shadow-lg">
      <Title level={4} className="mb-6 text-[#1a2b49]">
        Book Your Hotel
      </Title>
      <CustomProgressBar step={step} setStep={setStep} />
      {loading ? (
        <div className="flex justify-center p-8">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : (
        steps[step]?.content
      )}
      <div className="flex justify-between mt-8">
        {step > 0 && (
          <Button
            onClick={() => setStep(step - 1)}
            className="bg-[#9DB2BF] border-[#9DB2BF] hover:bg-[#686d7e] hover:border-[#686d7e] text-white"
          >
            Previous
          </Button>
        )}
      </div>
    </Card>
  );
};

export default BookHotel;
