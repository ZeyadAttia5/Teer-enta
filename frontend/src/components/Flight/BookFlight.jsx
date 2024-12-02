import React, { useState } from "react";
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
} from "lucide-react";
import { Fade } from "react-awesome-reveal";

const { Title, Text } = Typography;
const { Option } = Select;

// const BookFlight = () => {
//   const [form] = Form.useForm();
//   const [currentStep, setCurrentStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [flights, setFlights] = useState([]);
//   const [selectedFlight, setSelectedFlight] = useState(null);
//   const [destination, setDestination] = useState({});
//   const [departure, setDeparture] = useState({});
//   const [departureAirports, setDepartureAirports] = useState([]);
//   const [destinationAirports, setDestinationAirports] = useState([]);
//   const [promoCode, setPromoCode] = useState(null)

//   const fetchFlights = async () => {
//     setLoading(true);

//     try {
//       const { data } = await getFlightOffers(
//         form.getFieldValue("departureAirport"),
//         form.getFieldValue("destinationAirport"),
//         form.getFieldValue("departureDate"),
//         1
//       );
//       setFlights(data);

//       console.log(data);
//     } catch (error) {
//       console.log("Error fetching flights:", error);
//     }
//     setLoading(false);
//   };

//   const fetchAirports = async () => {
//     setLoading(true);
//     try {
//       const { data: depAirports } = await getAirports(
//         departure?.city,
//         departure?.country
//       );
//       const { data: destAirports } = await getAirports(
//         destination?.city,
//         destination?.country
//       );

//       setDestinationAirports(
//         destAirports?.data.map((airport) => ({
//           name: airport.name,
//           iataCode: airport.iataCode,
//         }))
//       );
//       setDepartureAirports(
//         depAirports?.data.map((airport) => ({
//           name: airport.name,
//           iataCode: airport.iataCode,
//         }))
//       );
//       console.log(departureAirports, destinationAirports);
//     } catch (error) {
//       console.log("Error fetching airports:", error);
//     }
//     setLoading(false);
//   };

//   const steps = [
//     {
//       title: "Select Cities",
//       content: (
//         <Form.Item className="mt-8">
//           {loading ? (
//             <div className="flex justify-center p-8">
//               <Spin
//                 indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
//               />
//             </div>
//           ) : (
//             <Row gutter={16} className="w-full">
//               <Col span={10}>
//                 <Form.Item
//                   name="departure"
//                   label="Departure City"
//                   rules={[
//                     { required: true, message: "Please input departure city!" },
//                   ]}
//                 >
//                   <AutoComplete
//                     className="w-full border shadow-sm p-2 rounded transition-all duration-300"
//                     apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//                     onPlaceSelected={(place) => {
//                       let departureCity =
//                         place?.address_components[0].long_name;
//                       let departureCountry =
//                         place?.address_components[
//                           place.address_components.length - 1
//                         ].short_name;

//                       setDeparture({
//                         city: departureCity,
//                         country: departureCountry,
//                       });
//                       form.setFieldsValue({
//                         departure: `${departureCity}, ${departureCountry}`,
//                       });
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={4} className="flex items-center justify-center">
//                 <ArrowRightOutlined style={{ fontSize: "24px" }} />
//               </Col>
//               <Col span={10}>
//                 <Form.Item
//                   name="arrival"
//                   label="Arrival City"
//                   rules={[
//                     { required: true, message: "Please input arrival city!" },
//                   ]}
//                 >
//                   <AutoComplete
//                     className="w-full border shadow-sm p-2 rounded transition-all duration-300"
//                     apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//                     onPlaceSelected={(place) => {
//                       let destinationCity =
//                         place?.address_components[0].long_name;
//                       let destinationCountry =
//                         place?.address_components[
//                           place.address_components.length - 1
//                         ].short_name;
//                       setDestination({
//                         city: destinationCity,
//                         country: destinationCountry,
//                       });
//                       form.setFieldsValue({
//                         arrival: `${destinationCity}, ${destinationCountry}`,
//                       });
//                     }}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
//           )}
//         </Form.Item>
//       ),
//     },
//     {
//       title: "Select Airports and Departure Date",
//       content: (
//         <Form.Item className="mt-8">
//           {loading ? (
//             <div className="flex justify-center p-8">
//               <Spin
//                 indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
//               />
//             </div>
//           ) : (
//             <Space direction="vertical" className="w-full">
//               <Form.Item
//                 label="Departure Airport"
//                 name="departureAirport"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please input departure airport!",
//                   },
//                 ]}
//               >
//                 <Select
//                   name="departureAirport"
//                   placeholder="Select departure airport"
//                   onChange={(value) => {
//                     form.setFieldsValue({ departureAirport: value });
//                   }}
//                   className="transition-all duration-300"
//                 >
//                   {departureAirports?.map((airport, index) => (
//                     <Option key={index} value={airport.iataCode}>
//                       {airport.name} ({airport.iataCode})
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>

//               <Form.Item
//                 label="Destination Airport"
//                 name="destinationAirport"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please input destination airport!",
//                   },
//                 ]}
//               >
//                 <Select
//                   name="destinationAirport"
//                   placeholder="Select destination airport"
//                   onChange={(value) => {
//                     form.setFieldsValue({ destinationAirport: value });
//                   }}
//                   className="transition-all duration-300"
//                 >
//                   {destinationAirports?.map((airport, index) => (
//                     <Option key={index} value={airport.iataCode}>
//                       {airport.name} ({airport.iataCode})
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//               <Form.Item
//                 label="Departure Date"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please select departure date!",
//                   },
//                 ]}
//               >
//                 <DatePicker
//                   name="departureDate"
//                   className="w-full transition-all duration-300"
//                   disabledDate={(current) => {
//                     return current && current < new Date();
//                   }}
//                   onChange={(date) => {
//                     form.setFieldsValue({
//                       departureDate: date.format("YYYY-MM-DD"),
//                     });
//                     console.log(form.getFieldValue("departureDate"));
//                   }}
//                 />
//               </Form.Item>
//             </Space>
//           )}
//         </Form.Item>
//       ),
//     },
//     {
//       title: "Select Flight",
//       content: (
//         <Form.Item className="mt-8">
//           {loading ? (
//             <div className="flex justify-center p-8">
//               <Spin
//                 indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
//               />
//             </div>
//           ) : (
//             <div className="flight-list">
//               {flights?.map((flight) => (
//                 <Card
//                   key={flight.id}
//                   className={`flight-card ${
//                     selectedFlight?.id === flight.id ? "selected-flight" : ""
//                   } transition-all duration-300`}
//                   hoverable
//                   onClick={() => setSelectedFlight(flight)}
//                   style={{
//                     marginBottom: "16px",
//                     border:
//                       selectedFlight?.id === flight.id
//                         ? "2px solid #1890ff"
//                         : "none",
//                     transform:
//                       selectedFlight?.id === flight.id ? "scale(1.03)" : "none",
//                     backgroundImage:
//                       "url('/path/to/your/travel-background.jpg')",
//                     backgroundSize: "cover",
//                     color: "#fff",
//                   }}
//                 >
//                   <Text strong style={{ fontSize: "18px" }}>
//                     {flight.itineraries[0].segments[0].departure.iataCode} →{" "}
//                     {flight.itineraries[0].segments[0].arrival.iataCode}
//                   </Text>
//                   <br />
//                   <Text type="secondary" style={{ fontSize: "16px" }}>
//                     Departure: {flight.itineraries[0].segments[0].departure.at}
//                   </Text>
//                   <br />
//                   <Text type="secondary" style={{ fontSize: "16px" }}>
//                     Price: {flight.price.total} {flight.price.currency}
//                   </Text>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </Form.Item>
//       ),
//     },
//     {
//       title: "Passenger Details",
//       content: loading ? (
//         <div className="flex justify-center p-8">
//           <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
//         </div>
//       ) : (
//         <Space direction="vertical" className="w-full mt-8">
//           <Form.Item
//             label="First Name"
//             name={["passenger", "name", "firstName"]}
//             rules={[{ required: true, message: "Please input first name!" }]}
//           >
//             <Input
//               placeholder="Enter first name"
//               className="transition-all duration-300"
//             />
//           </Form.Item>

//           <Form.Item
//             label="Last Name"
//             name={["passenger", "name", "lastName"]}
//             rules={[{ required: true, message: "Please input last name!" }]}
//           >
//             <Input
//               placeholder="Enter last name"
//               className="transition-all duration-300"
//             />
//           </Form.Item>

//           <Form.Item
//             label="Date of Birth"
//             name={["passenger", "dateOfBirth"]}
//             rules={[
//               { required: true, message: "Please select date of birth!" },
//             ]}
//           >
//             <DatePicker className="w-full transition-all duration-300" />
//           </Form.Item>

//           <Form.Item
//             label="Gender"
//             name={["passenger", "gender"]}
//             rules={[{ required: true, message: "Please select gender!" }]}
//           >
//             <Select
//               placeholder="Select gender"
//               className="transition-all duration-300"
//             >
//               <Option value="MALE">Male</Option>
//               <Option value="FEMALE">Female</Option>
//               <Option value="OTHER">Other</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item
//             label="Email"
//             name={["passenger", "contact", "emailAddress"]}
//             rules={[
//               { required: true, message: "Please input email!" },
//               { type: "email", message: "Please enter a valid email!" },
//             ]}
//           >
//             <Input
//               placeholder="Enter email address"
//               className="transition-all duration-300"
//             />
//           </Form.Item>

//           <Form.Item
//             label="Country Code"
//             name={["passenger", "contact", "phones", 0, "countryCallingCode"]}
//             rules={[{ required: true, message: "Please input country code!" }]}
//           >
//             <Input
//               placeholder="e.g. 34"
//               style={{ width: "120px" }}
//               className="transition-all duration-300"
//             />
//           </Form.Item>

//           <Form.Item
//             label="Phone Number"
//             name={["passenger", "contact", "phones", 0, "number"]}
//             rules={[{ required: true, message: "Please input phone number!" }]}
//           >
//             <Input
//               placeholder="Enter phone number"
//               className="transition-all duration-300"
//             />
//           </Form.Item>
//         </Space>
//       ),
//     },
//     {
//       title: "Payment",
//       content: (
//         <BookingPayment
//           onBookingClick={form.submit}
//           isloading={loading}
//           amount={selectedFlight && selectedFlight.price.total}
//           setPromoCode={setPromoCode}
//         />
//       ),
//     },
//   ];

//   const handleNextStep = async () => {
//     try {
//       const values = await form.validateFields();
//       if (currentStep === 0) await fetchAirports();
//       if (currentStep === 1) await fetchFlights();
//       setCurrentStep(currentStep + 1);
//     } catch (errorInfo) {
//       console.log("Validation failed:", errorInfo);
//     }
//   };

//   const handlePrevStep = () => {
//     setCurrentStep(currentStep - 1);
//   };

//   const handleFinish = async (values) => {
//     console.log(values);
//     setLoading(true);
//     try {
//       const user = localStorage.getItem("user");
//       if (user) {
//         let data = await bookFlight(selectedFlight, [
//           {
//             id: 1,
//             ...values.passenger,
//             dateOfBirth: values.passenger.dateOfBirth.format("YYYY-MM-DD"),
//             contact: {
//               ...values.passenger.contact,
//               phones: [
//                 {
//                   deviceType: "MOBILE",
//                   ...values.passenger.contact.phones[0],
//                 },
//               ],
//             },
//           },
//         ],promoCode);
//         console.log(data.data);
//         message.success("Booking submitted successfully!");
//         setCurrentStep(0);
//       } else {
//         message.error("Please login to book a flight");
//       }
//     } catch (error) {
//       console.log("Error submitting booking:");
//       console.log(error);
//       message.error(error.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const [isAtBottom, setIsAtBottom] = useState(false);

//   const handleScroll = () => {
//     const bottom =
//       Math.ceil(window.innerHeight + window.scrollY) >=
//       document.documentElement.scrollHeight - 50;
//     setIsAtBottom(bottom);
//   };

//   React.useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <Card className="w-11/12 my-20 mx-auto shadow">
//       <Title level={4} className="mb-6">
//         Book Your Flight
//       </Title>

//       <Steps current={currentStep} items={steps} className="mb-8" />

//       <Form form={form} layout="vertical" onFinish={handleFinish}>
//         {steps[currentStep]?.content}

//         {selectedFlight && (
//           <Card className="mb-4" size="small">
//             <div className="flex justify-between items-center">
//               <div>
//                 <Text strong>Selected Flight:</Text>
//                 <br />
//                 <Text type="secondary">
//                   {
//                     selectedFlight?.itineraries[0]?.segments[0]?.departure
//                       ?.iataCode
//                   }{" "}
//                   →{" "}
//                   {
//                     selectedFlight?.itineraries[0]?.segments[0]?.arrival
//                       ?.iataCode
//                   }{" "}
//                   | {selectedFlight?.itineraries[0]?.segments[0]?.departure?.at}{" "}
//                   |{selectedFlight?.price?.total}{" "}
//                   {selectedFlight?.price?.currency}
//                 </Text>
//               </div>
//               <Button
//                 type="text"
//                 icon={<CloseOutlined />}
//                 onClick={() => setSelectedFlight(null)}
//               />
//             </div>
//           </Card>
//         )}

//         <div className="flex justify-between mt-8">
//           {currentStep > 0 && (
//             <Button onClick={handlePrevStep}>Previous</Button>
//           )}

//           {currentStep < steps?.length - 1 && (
//             <Button type="primary" onClick={handleNextStep} className="ml-auto">
//               Next
//             </Button>
//           )}

//           {/* {currentStep === steps?.length - 1 && (
//             <Button type="primary" onClick={() => form.submit()}>
//               Complete Booking
//             </Button>
//           )} */}
//         </div>
//       </Form>

//       {currentStep === 2 && selectedFlight && !isAtBottom && (
//         <Button
//           type="primary"
//           onClick={handleNextStep}
//           style={{ position: "fixed", bottom: "16px", right: "16px" }}
//         >
//           Next
//         </Button>
//       )}
//     </Card>
//   );
// };

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
          {offer.price.grandTotal} €
        </section>
      </footer>
    </article>
  );
};

const BookFlight = () => {
  const [form] = Form.useForm();
  const [flights, setFlights] = useState([]);
  const [promoCode, setPromoCode] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [departureAirports, setDepartureAirports] = useState([]);
  const [destinationAirports, setDestinationAirports] = useState([]);
  const [loading, setLoading] = useState(-1);

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
      console.log(form.getFieldsValue());
      if (step > currentStep) await form.validateFields();
      setCurrentStep(step);
      if (step === 1) fetchAirports();
      if (step === 2) fetchFlights();
      // if (step === 3)
    } catch (error) {
      message.error("Please fill in all required fields");
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
        className="mt-8 "
        name={"selectedFlight"}
        label="Select Flight Offer"
        rootClassName="h-[400px] overflow-scroll"
        rules={[{ required: true, message: "Please Select An offer" }]}
      >
        <div className="h-[400px] overflow-scroll">
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
        isloading={loading}
        amount={selectedOffer && flights[selectedOffer]?.price?.grandTotal }
        setPromoCode={setPromoCode}
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
            src="https://watermark.lovepik.com/photo/50099/3731.jpg_wh1200.jpg"
          />
        }
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
              layout="vertical"
            >
              <Fade direction="up" cascade>
                {loading !== -1 ? (
                  <Spin className="flex-1 justify-center flex" />
                ) : (
                  stepContent[currentStep]
                )}
              </Fade>
              <footer className="flex justify-between mt-8">
                {/* {currentStep > 1 && (
                <Button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="w-1/2"
                >
                  Previous
                </Button>
              )}
              {currentStep < 1 && (
                <Button
                  type="primary"
                  onClick={() => {
                    console.log(form.getFieldsValue());
                    setCurrentStep(currentStep + 1)}}
                  className="w-1/2"
                >
                  Next
                </Button>
              )} */}
                {/* <Button
                  type="primary"
                  onClick={() => {
                    console.log(form.getFieldsValue());
                  }}
                >
                  log
                </Button> */}
              </footer>
            </Form>
            <footer className="">
              <Button
                type="default"
                onClick={() => handleStepChange(currentStep + 1)}
              >
                Next
              </Button>
            </footer>
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
                  icon: loading === 1 ? <LoadingOutlined /> : <PlaneTakeoff />,
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
    </ConfigProvider>
  );
};

export default BookFlight;
