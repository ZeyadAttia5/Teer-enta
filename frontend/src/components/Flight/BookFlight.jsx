import React, {useEffect, useState} from "react";
import bookFlightPic from "../../assets/Motivational Plane Travel Instagram Story.png";
import {
  Card,
  Form,
  Select,
  DatePicker,
  Button,
  Steps,
  Spin,
  Typography,
  ConfigProvider,
  Input,
  Space,
  Row,
  Col,
  message,
  Result, notification,
} from "antd";
import {
  LoadingOutlined,
  ArrowDownOutlined,
  ArrowRightOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import AutoComplete from "react-google-autocomplete";
import { bookFlight, getAirports, getFlightOffers } from "../../api/flights.ts";
import BookingPayment from "../shared/BookingPayment.jsx";
import {
  PlaneTakeoff,
  PlaneLanding,
  Calendar,
  Flag,
  Ticket,
  UserRound,
  CreditCard,
  SquareChevronLeft,
  SquareChevronRight,
} from "lucide-react";
import { Fade } from "react-awesome-reveal";
import { useNavigate } from "react-router-dom";
import {getCurrency} from "../../api/account.ts";
import LoginConfirmationModal from "../shared/LoginConfirmationModel";

const { Option } = Select;


const FlightTicket = ({
  departureCity = "New York",
  destinationCity = "San Fransisco",
  selectionKey,
  isSelected,
  onClick,
  offer,
}) => {
  let departureDate = new Date(offer.itineraries[0].segments[0].departure.at);
  let month = departureDate.toLocaleString("default", { month: "short" });
  let day = departureDate.toLocaleString("default", { day: "2-digit" });
  let year = departureDate.toLocaleString("default", { year: "numeric" });
  let dateString = `${day} ${month} ${year}`;
  let time = departureDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const data = [
    {
      title: "Date",
      value: dateString,
    },
    {
      title: "Time",
      value: time,
    },
    {
      title: "Bag",
      value: "40kg",
    },
  ];
  const [currency,setCurrency] = useState(null);
  useEffect(() => {
    fetchCurrency() ;
  }, []);
  const fetchCurrency = async () => {
    try {
      const response = await getCurrency();
      setCurrency(response.data);
      // console.log("Currency:", response.data);
    } catch (error) {
      console.error("Fetch currency error:", error);
    }
  }


  return (
    <article
      onClick={() => onClick(selectionKey)}
      className={`w-full bg-slate-50 ${
        isSelected && "border-blue-500 border-4"
      } cursor-pointer p-10 h-[300px] justify-between flex flex-col  shadow rounded-xl my-2`}
    >
      <header className="flex items-baseline flex-1 w-full justify-between">
        <div>
          <h1 className="text-xl font-bold">
            {offer.itineraries[0].segments[0].departure.iataCode}
          </h1>
          <span className="self-start text-gray-500	text-[12px] font-extralight	">
            {departureCity}
          </span>
        </div>
        <div className="flex  text-2xl relative h-full px-4	flex-1 ">
          <hr className="w-full border" />
          <PlaneTakeoff
            className="self-end top-[-20px] bg-slate-50 left-[35%] absolute"
            size={34}
            strokeWidth={0.5}
          />
        </div>
        <div>
          <h1 className="text-xl font-bold">
            {offer.itineraries[0].segments[0].arrival.iataCode}
          </h1>
          <span className="self-start text-gray-500	text-[12px] font-extralight	">
            {destinationCity}
          </span>
        </div>
      </header>
      <main className="flex justify-between flex-1">
        {data.map(({ title, value }, i) => (
          <div key={i} className="flex flex-col  items-center">
            <span className="self-start text-gray-400	text-xs font-extralight	">
              {title}
            </span>
            <span className="">{value}</span>
          </div>
        ))}
      </main>
      <footer className="flex justify-between">
        <section className=" text-lg">
          {offer.carrier}{" "}
          <div className="text-xs font-light">
            ⭐️ 4.9 <span className="text-gray-500">(78.4K)</span>
          </div>
        </section>
        <section className="font-bold text-2xl ">
          {(currency?.rate * offer.price.grandTotal).toFixed(2)} {currency?.code}
        </section>
      </footer>
    </article>
  );
};

const BookFlight = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();


  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(-1);
  const [promoCode, setPromoCode] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [departureAirports, setDepartureAirports] = useState([]);
  const [destinationAirports, setDestinationAirports] = useState([]);
  const [currency,setCurrency] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const user = localStorage.getItem("user");
  useEffect(() => {
    fetchCurrency() ;
  }, []);
  const fetchCurrency = async () => {
    try {
      const response = await getCurrency();
      setCurrency(response.data);
      // console.log("Currency:", response.data);
    } catch (error) {
      console.error("Fetch currency error:", error);
    }
  }

  const fetchAirports = async () => {
    setLoading(1);
    let [departureCity, departureCountry] = form
      .getFieldValue("departure")
      .split(",");
    let [destinationCity, destinationCountry] = form
      .getFieldValue("arrival")
      .split(",");
    try {
      const { data: depAirports } = await getAirports(
        departureCity,
        departureCountry
      );
      const { data: destAirports } = await getAirports(
        destinationCity,
        destinationCountry
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
    } catch (error) {
      console.log("Error fetching airports:", error);
    }
    setLoading(-1);
  };

  const fetchFlights = async () => {
    setLoading(2);

    try {
      let formattedForm = form
        .getFieldValue("departureDate")
        .format("YYYY-MM-DD");
      const { data } = await getFlightOffers(
        form.getFieldValue("departureAirport"),
        form.getFieldValue("destinationAirport"),
        formattedForm,
        1
      );
      setFlights(data);

      console.log(data);
    } catch (error) {
      console.log("Error fetching flights:", error);
    }
    setLoading(-1);
  };

  const handleStepChange = async (step) => {
    try {
      console.log(form.getFieldsValue(true));
      if (step > currentStep) await form.validateFields();
      setCurrentStep(step);
      if (step === 1) fetchAirports();
      if (step === 2) fetchFlights();
      if (step === 3){
        if(!user){
          setIsLoginModalOpen(true);
          setCurrentStep(2);
          return;
        }
      }
    } catch (error) {
      message.warning("Please fill in all required fields");
    }
  };
  const handleFinish = async (_) => {
    setLoading(4);
    const values = form.getFieldsValue(true);
    try {
      const user = localStorage.getItem("user");
      if (user) {
        let data = await bookFlight(
          values["selectedFlight"],
          [
            {
              id: 1,
              dateOfBirth: "2024-10-10",
              name: {
                firstName: values.firstName,
                lastName: values.lastName,
              },
              gender: values.gender.toUpperCase(),

              contact: {
                emailAddress: values.email,
                phones: [
                  {
                    deviceType: "MOBILE",
                    countryCallingCode: "20",
                    number: values.phoneNumber,
                  },
                ],
              },
            },
          ],
          promoCode,
          paymentMethod
        );
        message.success("Booking submitted successfully!");
        setCurrentStep(5);
      } else {
        setIsLoginModalOpen(true);
      }
    } catch (error) {
      console.log("Error submitting booking:");
      console.log(error);
      message.warning(error?.response?.data?.message);
    } finally {
      setLoading(-1);
    }
  };

  const fields = {
    0: [
      {
        name: "departure",
        label: (
          <span className="flex items-center">
            Departure City <PlaneTakeoff className="ml-2" size={15} />
          </span>
        ),
        rules: [{ required: true, message: "Please input departure city!" }],
        component: (
          <AutoComplete
            className="w-full border shadow-sm p-2 rounded transition-all duration-300"
            apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            onPlaceSelected={(place) => {
              if (!place?.address_components) return;
              let departureCity = place?.address_components[0].long_name;
              let departureCountry =
                place?.address_components[place.address_components.length - 1]
                  .short_name;
              form.setFieldValue(
                "departure",
                `${departureCity},${departureCountry}`
              );
            }}
          />
        ),
      },
      {
        name: "arrival",
        label: (
          <span className="flex items-center">
            Arrival City <PlaneLanding className="ml-2" size={15} />
          </span>
        ),
        rules: [{ required: true, message: "Please input arrival city!" }],
        component: (
          <AutoComplete
            className="w-full border shadow-sm p-2 rounded transition-all duration-300"
            apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            onPlaceSelected={(place) => {
              if (!place?.address_components) return;
              let destinationCity = place?.address_components[0].long_name;
              let destinationCountry =
                place?.address_components[place.address_components.length - 1]
                  .short_name;
              form.setFieldValue(
                "arrival",
                `${destinationCity},${destinationCountry}`
              );
            }}
          />
        ),
      },
    ],
    1: [
      {
        name: "departureAirport",
        label: (
          <span className="flex items-center">
            Departure Airport <PlaneTakeoff className="ml-2" size={15} />
          </span>
        ),
        rules: [{ required: true, message: "Please input departure airport!" }],
        component: (
          <Select
            name="departureAirport"
            placeholder="Select departure airport"
            className="transition-all duration-300"
          >
            {departureAirports?.map((airport, index) => (
              <Option key={index} value={airport.iataCode}>
                {airport.name} ({airport.iataCode})
              </Option>
            ))}
          </Select>
        ),
      },
      {
        name: "destinationAirport",
        label: (
          <span className="flex items-center">
            Destination Airport <PlaneLanding className="ml-2" size={15} />
          </span>
        ),
        rules: [
          { required: true, message: "Please input destination airport!" },
        ],
        component: (
          <Select
            name="destinationAirport"
            placeholder="Select destination airport"
            className="transition-all duration-300"
          >
            {destinationAirports?.map((airport, index) => (
              <Option key={index} value={airport.iataCode}>
                {airport.name} ({airport.iataCode})
              </Option>
            ))}
          </Select>
        ),
      },
      {
        name: "departureDate",
        label: (
          <span className="flex items-center">
            Departure Date <Calendar className="ml-2" size={15} />
          </span>
        ),
        rules: [{ required: true, message: "Please select departure date!" }],
        component: (
          <DatePicker
            name="departureDate"
            className="w-full transition-all duration-300"
            disabledDate={(current) => {
              return current && current < new Date();
            }}
          />
        ),
      },
    ],
    3: [
      {
        name: "firstName",
        label: "First Name",
        rules: [{ required: true, message: "Please input first name!" }],
        component: <Input placeholder="Enter first name" />,
      },
      {
        name: "lastName",
        label: "Last Name",
        rules: [{ required: true, message: "Please input last name!" }],
        component: <Input placeholder="Enter last name" />,
      },
      {
        name: "gender",
        label: "Gender",
        rules: [{ required: true, message: "Please select your gender" }],
        component: (
          <Select
            placeholder="Select Gender"
            className="w-full transition-all duration-300"
          >
            {["Male", "Female", "Other"].map((e) => (
              <Option key={e} value={e}>
                {e}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        name: "email",
        label: "Email",
        rules: [
          { required: true, message: "Please input email!" },
          { type: "email", message: "Please enter a valid email!" },
        ],
        component: <Input placeholder="Enter email address" />,
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        rules: [{ required: true, message: "Please input phone number!" }],
        component: <Input placeholder="Enter phone number" />,
      },
    ],
  };
  const stepContent = {
    0: fields[0].map((field, index) => (
      <Form.Item key={index} {...field} className="mt-8">
        {field.component}
      </Form.Item>
    )),
    1: fields[1].map((field, index) => (
      <Form.Item key={index} {...field} className="mt-8">
        {field.component}
      </Form.Item>
    )),
    2: (
      <Form.Item
        className="mt-8"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // Internet Explorer and Edge
        }}
        name={"selectedFlight"}
        label="Select Flight Offer"
        rootClassName="h-[400px] overflow-y-scroll overflow-hide"
        rules={[{ required: true, message: "Please Select An offer" }]}
      >
        <div
          className="h-[400px] overflow-y-scroll overflow-hidden"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // Internet Explorer and Edge
          }}
        >
          <Fade direction="up" triggerOnce>
            {flights.map((flight, index) => (
              <FlightTicket
                key={index}
                isSelected={index === selectedOffer}
                offer={flight}
                departureCity={form.getFieldValue("departure").split(",")[0]}
                destinationCity={form.getFieldValue("arrival").split(",")[0]}
                selectionKey={index}
                onClick={(key) => {
                  form.setFieldValue("selectedFlight", flights[key]);
                  setSelectedOffer(key);
                }}
              />
            ))}
          </Fade>
        </div>
      </Form.Item>
    ),
    3: fields[3].map((field, index) => (
      <Form.Item key={index} {...field}>
        {field.component}
      </Form.Item>
    )),
    4: (
      <BookingPayment
        onBookingClick={form.submit}
        isloading={loading === 3}
        amount={flights[selectedOffer] && flights[selectedOffer].price.total}
        setPromoCode={setPromoCode}
        setPaymentMethod={setPaymentMethod}
        currency={currency}
      />
    ),
    5: (
      <Result
        status="success"
        title="Successfully Booked Flight,Have a safe journey!"
        subTitle="Flight number: 2017182818828182881"
        extra={[
          <Button type="default" onClick={e=>{
            form.resetFields()
            navigate('/')
          }}>
            Go Home
          </Button>,
          <Button
          type="primary"
            onClick={(e) => {
              form.resetFields();
              setCurrentStep(0);
            }}
          >
            Book Another Flight
          </Button>,
        ]}
      />
    ),
  };

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
      <div className="flex justify-center">
        <LoginConfirmationModal
            open={isLoginModalOpen}
            setOpen={setIsLoginModalOpen}
            content="Please login to Book a flight."
        />
        <Card
            className="w-[90%] h-[630px] flex my-20 mx-auto shadow"
            classNames={{
              body: "flex flex-1 flex-col justify-center",
              cover: "w-1/3",
            }}
            cover={<img alt="" className="size-full " src={bookFlightPic} />}
        >
          <header>
            <Typography.Title level={4} className="mb-6">
              Book Your Flight
            </Typography.Title>
          </header>
          <main className="h-full flex mt-6 ">
            <section className="flex-1 flex flex-col justify-center items-center">
              <Form
                scrollToFirstError
                className="w-full flex flex-col justify-center px-4 flex-1"
                form={form}
                onFinish={handleFinish}
                layout="vertical"
                preserve
              >
                <Fade direction="up" cascade>
                  {loading !== -1 ? (
                    <Spin className="flex-1 justify-center flex" />
                  ) : (
                    stepContent[currentStep]
                  )}
                </Fade>
              </Form>

              {loading === -1 && currentStep!=5 && (
                <Fade direction="up">
                  <footer className="flex gap-2">
                    {currentStep > 0 && (
                      <Button
                        type="default"
                        onClick={() => setCurrentStep(currentStep - 1)}
                      >
                        <SquareChevronLeft strokeWidth={3} />
                        Previous
                      </Button>
                    )}
                    {currentStep != 4 && (
                      <Button
                        type="default"
                        onClick={() => handleStepChange(currentStep + 1)}
                      >
                        Next
                        <SquareChevronRight strokeWidth={3} />
                      </Button>
                    )}
                  </footer>
                </Fade>
              )}
            </section>
            <section className="h-full flex-[0.4]">
              <Steps
                direction="vertical"
                current={currentStep}
                onChange={handleStepChange}
                className="h-full"
                items={[
                  {
                    title: "Select cities ",
                    icon: <Flag strokeWidth={1.5} />,
                  },
                  {
                    title: "Select Airports and Departure Date",
                    icon:
                      loading === 1 ? <LoadingOutlined /> : <PlaneTakeoff />,
                  },
                  {
                    title: "Select Offer",
                    icon: loading === 2 ? <LoadingOutlined /> : <Ticket />,
                  },
                  {
                    title: "Passenger Details",
                    icon: loading === 3 ? <LoadingOutlined /> : <UserRound />,
                  },
                  {
                    title: "Payment",
                    icon:
                      loading === 4 ? (
                        <LoadingOutlined />
                      ) : (
                        <CreditCard strokeWidth={1.5} />
                      ),
                  },
                ]}
              />
            </section>
          </main>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default BookFlight;