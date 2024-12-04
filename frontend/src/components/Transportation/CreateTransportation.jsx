import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Switch,
  Button,
  Card,
  Space,
  Row,
  Col,
  message,
  ConfigProvider,
} from "antd";
import { ClipboardList } from "lucide-react";
import { DollarOutlined } from "@ant-design/icons";
import { createTransportation } from "../../api/transportation.ts";
import MapContainer from "../shared/GoogleMaps/GoogleMaps";

const { TextArea } = Input;
const { Option } = Select;

const CreateTransportation = () => {
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("user"));

  const [dropOffLocation, setDropOffLocation] = useState({
    lat: 26.820553,
    lng: 30.802498,
  });
  const [pickupLocation, setPickupLocation] = useState({
    lat: 26.820553,
    lng: 30.802498,
  });

  const handleSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        date: values.date.toISOString(),
        pickupLocation: {
          lat: parseFloat(pickupLocation.lat),
          lng: parseFloat(pickupLocation.lng),
        },
        dropOffLocation: {
          lat: parseFloat(dropOffLocation.lat),
          lng: parseFloat(dropOffLocation.lng),
        },
        created_by: user?._id,
      };
      try {
        await createTransportation(formattedValues);
        message.success("Transportation created successfully");
      } catch (error) {
        message.error("Failed to create transportation");
        console.error("Form submission error:", error);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1C325B",
        },
      }}
    >
      <div className="flex justify-center">
        <div className="w-[90%] p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Header Section */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 text-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <ClipboardList className="w-6 h-6 text-white" />
                      <h3
                        className="m-0 text-lg font-semibold"
                        style={{ color: "white" }}
                      >
                        Transportation Form
                      </h3>
                    </div>
                    <p className="text-gray-200 mt-2 mb-0 opacity-90">
                      Fill out the transportation details efficiently.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="p-6">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  className="bg-white rounded-lg"
                >
                  <Row gutter={16}>
                    {/* Pickup Location */}
                    <Col span={12}>
                      <Card
                        type="inner"
                        title="Pickup Location"
                        className="mb-4"
                      >
                        <MapContainer
                          longitude={pickupLocation.lng}
                          latitude={pickupLocation.lat}
                          outputLocation={(lat, lng) =>
                            setPickupLocation({ lat, lng })
                          }
                        />
                      </Card>
                    </Col>

                    {/* Drop-off Location */}
                    <Col span={12}>
                      <Card
                        type="inner"
                        title="Drop-off Location"
                        className="mb-4"
                      >
                        <MapContainer
                          longitude={dropOffLocation.lng}
                          latitude={dropOffLocation.lat}
                          outputLocation={(lat, lng) =>
                            setDropOffLocation({ lat, lng })
                          }
                        />
                      </Card>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      {/* Price */}
                      <Form.Item
                        label="Price"
                        name="price"
                        rules={[
                          { required: true, message: "Please enter the price" },
                        ]}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          placeholder="Enter price"
                          min={0}
                          precision={2}
                          prefix={<DollarOutlined />}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      {/* Date */}
                      <Form.Item
                        label="Date"
                        name="date"
                        rules={[
                          { required: true, message: "Please select a date" },
                        ]}
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      {/* Vehicle Type */}
                      <Form.Item
                        label="Vehicle Type"
                        name="vehicleType"
                        rules={[
                          {
                            required: true,
                            message: "Please select a vehicle type",
                          },
                        ]}
                      >
                        <Select placeholder="Select vehicle type">
                          <Option value="Car">Car</Option>
                          <Option value="Scooter">Scooter</Option>
                          <Option value="Bus">Bus</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      {/* Active Status */}
                      <Form.Item
                        label="Active Status"
                        name="isActive"
                        valuePropName="checked"
                      >
                        <Switch
                          checkedChildren="Active"
                          unCheckedChildren="Inactive"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Notes */}
                  <Form.Item
                    label="Notes"
                    name="notes"
                    rules={[{ required: true, message: "Please enter notes" }]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Enter any additional notes"
                    />
                  </Form.Item>

                  {/* Form Actions */}
                  <Form.Item>
                    <div className="flex justify-end gap-4">
                      <Button onClick={() => form.resetFields()}>Reset</Button>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default CreateTransportation;
