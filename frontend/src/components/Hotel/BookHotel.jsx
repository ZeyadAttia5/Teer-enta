import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  message,
  Steps,
  List,
  Typography,
  Tag,
  Space,
  Row,
  Col,
  Divider,
  Spin,
  ConfigProvider,
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
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { bookHotel, getHotels } from "../../api/hotels.ts";
import AutoComplete from "react-google-autocomplete";
import BookingPayment from "../shared/BookingPayment.jsx";
import { Fade } from "react-awesome-reveal";

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const CustomProgressBar = ({ step, setStep, loading }) => {
  const steps = [
    { label: "Choose City and Dates", icon: <SolutionOutlined /> },
    {
      label: "Hotel Offers",
      icon: loading ? <LoadingOutlined /> : <HomeOutlined />,
    },
    { label: "Payment", icon: <CreditCardOutlined /> },
  ];

  return (
    <Steps
      direction="vertical"
      className="h-full"
      current={step}
      onChange={setStep}
      items={steps.map((item, index) => ({
        title: item.label,
        icon: item.icon,
      }))}
    />
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
    <article
      onClick={() => console.log("Selected offer:", mainOffer?.id)}
      className={`w-full bg-slate-50 cursor-pointer p-10 h-auto justify-between flex flex-col shadow rounded-xl my-2`}
    >
      <header className="flex items-baseline flex-1 w-full justify-between">
        <div className="flex justify-between gap-2">
          <div className="mb-6">
            <h1 className="text-xl font-bold">
              {hotel?.name?.charAt(0).toUpperCase() + hotel?.name?.slice(1)}
            </h1>
            <span className="self-start text-gray-500 text-[12px] font-extralight">
              {hotel?.cityCode?.charAt(0).toUpperCase() +
                hotel?.cityCode?.slice(1)}
            </span>
          </div>
          <div>
            <Tag
              className="rounded-lg"
              color={
                mainOffer?.policies?.paymentType === "deposit"
                  ? "blue"
                  : "green"
              }
            >
              {mainOffer?.policies?.paymentType?.charAt(0).toUpperCase() +
                mainOffer?.policies?.paymentType?.slice(1)}
            </Tag>
          </div>
        </div>
      </header>
      <main className="flex gap-10 flex-1">
        <div className="flex flex-col items-center">
          <span className="self-start text-gray-400 text-xs font-extralight">
            Check-in
          </span>
          <span>{formatDate(mainOffer?.checkInDate)}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="self-start text-gray-400 text-xs font-extralight">
            Check-out
          </span>
          <span>{formatDate(mainOffer?.checkOutDate)}</span>
        </div>
      </main>
      <footer className="flex mt-2">
        <div className="flex gap-14 w-full border-b-2 border-b-black pb-3">
          <section className="text-lg flex items-end">
            {mainOffer?.room?.typeEstimated?.bedType?.charAt(0).toUpperCase() +
              mainOffer?.room?.typeEstimated?.bedType?.slice(1)}{" "}
            Bed
          </section>
          <div className="flex flex-col items-center">
            <span className="self-start text-gray-400 text-xs font-extralight">
              Adults
            </span>
            <span>{mainOffer?.guests?.adults}</span>
          </div>
        </div>
      </footer>
      <div className="flex justify-end">
        <section className="font-bold text-2xl flex items-end mb-5">
          {parseFloat(mainOffer?.price?.total).toLocaleString()} €
        </section>
      </div>
      {mainOffer?.policies?.cancellations &&
        mainOffer?.policies?.cancellations[0]?.description && (
          <Text type="danger" className="text-sm mt-5 mb-3">
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
    </article>
  );
};

const ListOffers = ({ hotelOffers, setLoading, setOffer, setStep }) => {
  const [searchText, setSearchText] = React.useState("");
  const [filteredOffers, setFilteredOffers] = useState(hotelOffers);
  const listRef = useRef(null);

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = hotelOffers?.filter(
      (offer) =>
        offer.hotel.name.toLowerCase().includes(value.toLowerCase()) ||
        offer.hotel.cityCode.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOffers(filtered);
  };

  const handlePageChange = (page) => {
    console.log(page);

    // Scroll to the top of the list when page changes
    if (listRef.current) {
      listRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1a2b49]">Hotel Offers</h2>
        <div className="w-1/2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search hotels"
              className="w-full py-2 px-4 border border-[#9DB2BF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#526D82]"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <SearchOutlined className="absolute right-3 top-3 text-[#526D82]" />
          </div>
        </div>
      </div>

      <List
        ref={listRef}
        className={` overflow-y-scroll overflow-hidden h-96 x-10`}
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // Internet Explorer and Edge
        }}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 1,
          xl: 1,
          xxl: 1,
        }}
        dataSource={filteredOffers}
        renderItem={(offer) => (
          <List.Item className="w-full ">
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
            handlePageChange(page);
          },
          pageSize: 2,
          position: "bottom",
          align: "center",
          className: "pb-6",
        }}
      />
    </div>
  );
};

const HotelSearchForm = ({ setOffers, setLoading, onSearch, setStep }) => {
  const [form] = Form.useForm();

  const handleSearch = async () => {
    setLoading(true);
    const values = form.getFieldsValue();
    const formattedValues = {
      ...values,
      checkInDate: values.dates[0].format("YYYY-MM-DD"),
      checkOutDate: values.dates[1].format("YYYY-MM-DD"),
    };
    delete formattedValues.dates;

    console.log("Search criteria:", formattedValues);
    try {
      setLoading(true);
      setStep((prevStep) => prevStep + 1);
      let { data } = await getHotels(formattedValues);
      setOffers(data);
    } catch (error) {
      message.error("Error searching for hotels. Please try again later.");
    } finally {
      setLoading(false);

      // onSearch();
    }
  };

  const disabledDate = (current) => {
    return current && current < new Date().setHours(0, 0, 0, 0);
  };

  return (
    <Card className="max-w-xl mx-auto my-6 p-6 bg-[#DDE6ED] border border-gray-300">
      <Form
        form={form}
        layout="vertical"
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
            block
            size="large"
            className="bg-[#1a2b49] border-[#1a2b49] hover:bg-[#526D82] hover:border-[#526D82] text-white"
            icon={<SearchOutlined />}
            onClick={handleSearch}
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

  console.log("Step", step);
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
          setStep={setStep}
          // onSearch={() => setStep(step + 1)}
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
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultBg: "rgb(26,43,73)",
            defaultHoverBg: "rgb(82,109,130)",
            defaultColor: "white",
            defaultHoverColor: "white",
            defaultHoverBorderColor: "rgb(82,109,130)",
          },
        },
      }}
    >
      <Card
        className="w-11/12 min-h-[600px] flex my-20 mx-auto shadow"
        classNames={{
          body: "flex flex-1 flex-col justify-center",
          cover: "flex-1",
        }}
        cover={
          <img
            alt=""
            className="size-full"
            src="https://img.freepik.com/premium-vector/hotel-building-near-sea-seafront-resort-view-vector-illustration-flat-cartoon_101884-681.jpg?w=740"
          />
        }
      >
        <header className="flex flex-col gap-5">
          {step > 0 && !loading && (
            <ArrowLeftOutlined
              onClick={() => setStep(step - 1)}
              className="stroke-black text-lg cursor-pointer"
            />
          )}
          <Typography.Title level={4} className="mb-6">
            Book Your Hotel
          </Typography.Title>
        </header>
        <main className="h-full flex mt-6">
          <section className="flex-1 flex flex-col justify-center items-center">
            <Form
              scrollToFirstError
              className="w-full flex flex-col justify-center px-4 flex-1"
              layout="vertical"
            >
              <Fade direction="up" triggerOnce>
                {loading ? (
                  <Spin className="flex-1 justify-center flex" />
                ) : (
                  steps[step]?.content
                )}
              </Fade>
            </Form>
          </section>
          <section className="h-full flex-[0.4]">
            <CustomProgressBar
              step={step}
              setStep={setStep}
              loading={loading}
            />
          </section>
        </main>
      </Card>
    </ConfigProvider>
  );
};

export default BookHotel;
