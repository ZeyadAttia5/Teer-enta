import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Steps,
  Spin,
  Typography,
  Space,
  Row,
  Col,
  message,
} from "antd";
import {
  LoadingOutlined,
  ArrowRightOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import AutoComplete from "react-google-autocomplete";
import { bookFlight, getAirports, getFlightOffers } from "../../api/flights.ts";

const { Title, Text } = Typography;
const { Option } = Select;

const BookFlight = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [destination, setDestination] = useState({});
  const [departure, setDeparture] = useState({});
  const [departureAirports, setDepartureAirports] = useState([]);
  const [destinationAirports, setDestinationAirports] = useState([]);

  const fetchFlights = async () => {
    setLoading(true);

    try {
      const { data } = await getFlightOffers(
        form.getFieldValue("departureAirport"),
        form.getFieldValue("destinationAirport"),
        form.getFieldValue("departureDate"),
        1
      );
      setFlights(data);

      console.log(data);
    } catch (error) {
      console.log("Error fetching flights:", error);
    }
    setLoading(false);
  };

  const fetchAirports = async () => {
    setLoading(true);
    try {
      const { data: depAirports } = await getAirports(
        departure?.city,
        departure?.country
      );
      const { data: destAirports } = await getAirports(
        destination?.city,
        destination?.country
      );

      setDestinationAirports(
        destAirports?.data.map((airport) => ({
          name: airport.name,
          iataCode: airport.iataCode,
        }))
      );
      setDepartureAirports(
        depAirports?.data.map((airport) => ({
          name: airport.name,
          iataCode: airport.iataCode,
        }))
      );
      console.log(departureAirports, destinationAirports);
    } catch (error) {
      console.log("Error fetching airports:", error);
    }
    setLoading(false);
  };

  const steps = [
    {
      title: "Select Cities",
      content: (
        <Form.Item className="mt-8">
          {loading ? (
            <div className="flex justify-center p-8">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            </div>
          ) : (
            <Row gutter={16} className="w-full">
              <Col span={10}>
                <Form.Item
                  name="departure"
                  label="Departure City"
                  rules={[
                    { required: true, message: "Please input departure city!" },
                  ]}
                >
                  <AutoComplete
                    className="w-full border shadow-sm p-2 rounded transition-all duration-300"
                    apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                    onPlaceSelected={(place) => {
                      let departureCity =
                        place?.address_components[0].long_name;
                      let departureCountry =
                        place?.address_components[
                          place.address_components.length - 1
                        ].short_name;

                      setDeparture({
                        city: departureCity,
                        country: departureCountry,
                      });
                      form.setFieldsValue({
                        departure: `${departureCity}, ${departureCountry}`,
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={4} className="flex items-center justify-center">
                <ArrowRightOutlined style={{ fontSize: "24px" }} />
              </Col>
              <Col span={10}>
                <Form.Item
                  name="arrival"
                  label="Arrival City"
                  rules={[
                    { required: true, message: "Please input arrival city!" },
                  ]}
                >
                  <AutoComplete
                    className="w-full border shadow-sm p-2 rounded transition-all duration-300"
                    apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                    onPlaceSelected={(place) => {
                      let destinationCity =
                        place?.address_components[0].long_name;
                      let destinationCountry =
                        place?.address_components[
                          place.address_components.length - 1
                        ].short_name;
                      setDestination({
                        city: destinationCity,
                        country: destinationCountry,
                      });
                      form.setFieldsValue({
                        arrival: `${destinationCity}, ${destinationCountry}`,
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form.Item>
      ),
    },
    {
      title: "Select Airports and Departure Date",
      content: (
        <Form.Item className="mt-8">
          {loading ? (
            <div className="flex justify-center p-8">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            </div>
          ) : (
            <Space direction="vertical" className="w-full">
              <Form.Item
                label="Departure Airport"
                name="departureAirport"
                rules={[
                  {
                    required: true,
                    message: "Please input departure airport!",
                  },
                ]}
              >
                <Select
                  name="departureAirport"
                  placeholder="Select departure airport"
                  onChange={(value) => {
                    form.setFieldsValue({ departureAirport: value });
                  }}
                  className="transition-all duration-300"
                >
                  {departureAirports?.map((airport, index) => (
                    <Option key={index} value={airport.iataCode}>
                      {airport.name} ({airport.iataCode})
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Destination Airport"
                name="destinationAirport"
                rules={[
                  {
                    required: true,
                    message: "Please input destination airport!",
                  },
                ]}
              >
                <Select
                  name="destinationAirport"
                  placeholder="Select destination airport"
                  onChange={(value) => {
                    form.setFieldsValue({ destinationAirport: value });
                  }}
                  className="transition-all duration-300"
                >
                  {destinationAirports?.map((airport, index) => (
                    <Option key={index} value={airport.iataCode}>
                      {airport.name} ({airport.iataCode})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Departure Date"
                rules={[
                  {
                    required: true,
                    message: "Please select departure date!",
                  },
                ]}
              >
                <DatePicker
                  name="departureDate"
                  className="w-full transition-all duration-300"
                  disabledDate={(current) => {
                    return current && current < new Date();
                  }}
                  onChange={(date) => {
                    form.setFieldsValue({
                      departureDate: date.format("YYYY-MM-DD"),
                    });
                    console.log(form.getFieldValue("departureDate"));
                  }}
                />
              </Form.Item>
            </Space>
          )}
        </Form.Item>
      ),
    },
    {
      title: "Select Flight",
      content: (
        <Form.Item className="mt-8">
          {loading ? (
            <div className="flex justify-center p-8">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            </div>
          ) : (
            <div className="flight-list">
              {flights?.map((flight) => (
                <Card
                  key={flight.id}
                  className={`flight-card ${
                    selectedFlight?.id === flight.id ? "selected-flight" : ""
                  } transition-all duration-300`}
                  hoverable
                  onClick={() => setSelectedFlight(flight)}
                  style={{
                    marginBottom: "16px",
                    border:
                      selectedFlight?.id === flight.id
                        ? "2px solid #1890ff"
                        : "none",
                    transform:
                      selectedFlight?.id === flight.id ? "scale(1.03)" : "none",
                    backgroundImage:
                      "url('/path/to/your/travel-background.jpg')",
                    backgroundSize: "cover",
                    color: "#fff",
                  }}
                >
                  <Text strong style={{ fontSize: "18px" }}>
                    {flight.itineraries[0].segments[0].departure.iataCode} →{" "}
                    {flight.itineraries[0].segments[0].arrival.iataCode}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "16px" }}>
                    Departure: {flight.itineraries[0].segments[0].departure.at}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "16px" }}>
                    Price: {flight.price.total} {flight.price.currency}
                  </Text>
                </Card>
              ))}
            </div>
          )}
        </Form.Item>
      ),
    },
    {
      title: "Passenger Details",
      content: loading ? (
        <div className="flex justify-center p-8">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : (
        <Space direction="vertical" className="w-full mt-8">
          <Form.Item
            label="First Name"
            name={["passenger", "name", "firstName"]}
            rules={[{ required: true, message: "Please input first name!" }]}
          >
            <Input
              placeholder="Enter first name"
              className="transition-all duration-300"
            />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name={["passenger", "name", "lastName"]}
            rules={[{ required: true, message: "Please input last name!" }]}
          >
            <Input
              placeholder="Enter last name"
              className="transition-all duration-300"
            />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name={["passenger", "dateOfBirth"]}
            rules={[
              { required: true, message: "Please select date of birth!" },
            ]}
          >
            <DatePicker className="w-full transition-all duration-300" />
          </Form.Item>

          <Form.Item
            label="Gender"
            name={["passenger", "gender"]}
            rules={[{ required: true, message: "Please select gender!" }]}
          >
            <Select
              placeholder="Select gender"
              className="transition-all duration-300"
            >
              <Option value="MALE">Male</Option>
              <Option value="FEMALE">Female</Option>
              <Option value="OTHER">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Email"
            name={["passenger", "contact", "emailAddress"]}
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              placeholder="Enter email address"
              className="transition-all duration-300"
            />
          </Form.Item>

          <Form.Item
            label="Country Code"
            name={["passenger", "contact", "phones", 0, "countryCallingCode"]}
            rules={[{ required: true, message: "Please input country code!" }]}
          >
            <Input
              placeholder="e.g. 34"
              style={{ width: "120px" }}
              className="transition-all duration-300"
            />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name={["passenger", "contact", "phones", 0, "number"]}
            rules={[{ required: true, message: "Please input phone number!" }]}
          >
            <Input
              placeholder="Enter phone number"
              className="transition-all duration-300"
            />
          </Form.Item>
        </Space>
      ),
    },
  ];

  const handleNextStep = async () => {
    try {
      const values = await form.validateFields();

      if (currentStep === 0) await fetchAirports();
      if (currentStep === 1) await fetchFlights();
      setCurrentStep(currentStep + 1);
    } catch (errorInfo) {
      console.log("Validation failed:", errorInfo);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const user = localStorage.getItem("user");
      if (user) {
        let data = await bookFlight(selectedFlight, [
          {
            id: 1,
            ...values.passenger,
            dateOfBirth: values.passenger.dateOfBirth.format("YYYY-MM-DD"),
            contact: {
              ...values.passenger.contact,
              phones: [
                {
                  deviceType: "MOBILE",
                  ...values.passenger.contact.phones[0],
                },
              ],
            },
          },
        ]);
        console.log(data.data);
        message.success("Booking submitted successfully!");
      } else {
        message.error("Please login to book a flight");
      }
    } catch (error) {
      console.log("Error submitting booking:");
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight - 50;
    setIsAtBottom(bottom);
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Card className="w-11/12 my-20 mx-auto shadow">
      <Title level={4} className="mb-6">
        Book Your Flight
      </Title>

      <Steps current={currentStep} items={steps} className="mb-8" />

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {steps[currentStep]?.content}

        {selectedFlight && (
          <Card className="mb-4" size="small">
            <div className="flex justify-between items-center">
              <div>
                <Text strong>Selected Flight:</Text>
                <br />
                <Text type="secondary">
                  {
                    selectedFlight?.itineraries[0]?.segments[0]?.departure
                      ?.iataCode
                  }{" "}
                  →{" "}
                  {
                    selectedFlight?.itineraries[0]?.segments[0]?.arrival
                      ?.iataCode
                  }{" "}
                  | {selectedFlight?.itineraries[0]?.segments[0]?.departure?.at}{" "}
                  |{selectedFlight?.price?.total}{" "}
                  {selectedFlight?.price?.currency}
                </Text>
              </div>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setSelectedFlight(null)}
              />
            </div>
          </Card>
        )}

        <div className="flex justify-between mt-8">
          {currentStep > 0 && (
            <Button onClick={handlePrevStep}>Previous</Button>
          )}

          {currentStep < steps?.length - 1 && (
            <Button type="primary" onClick={handleNextStep} className="ml-auto">
              Next
            </Button>
          )}

          {currentStep === steps?.length - 1 && (
            <Button type="primary" onClick={() => form.submit()}>
              Complete Booking
            </Button>
          )}
        </div>
      </Form>

      {currentStep === 2 && selectedFlight && !isAtBottom && (
        <Button
          type="primary"
          onClick={handleNextStep}
          style={{ position: "fixed", bottom: "16px", right: "16px" }}
        >
          Next
        </Button>
      )}
    </Card>
  );
};

export default BookFlight;
