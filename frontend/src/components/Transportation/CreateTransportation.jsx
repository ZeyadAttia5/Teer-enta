import React from "react";
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
} from "antd";
import { DollarOutlined } from "@ant-design/icons";
import { createTransportation } from "../../api/transportation.ts";

const { TextArea } = Input;
const { Option } = Select;

const CreateTransportation =  () => {
  const [form] = Form.useForm();
  const user=JSON.parse(localStorage.getItem("user"));
  const handleSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        date: values.date.toISOString(),
        pickupLocation: {
          lat: parseFloat(values.pickupLat),
          lng: parseFloat(values.pickupLng),
        },
        dropOffLocation: {
          lat: parseFloat(values.dropOffLat),
          lng: parseFloat(values.dropOffLng),
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
    <Card
      title="Transportation Form"
      style={{ width:'95%', margin: "20px auto" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        // initialValues={{}}
      >
        <Row gutter={16}>
          {/* Pickup Location */}
          <Col span={12}>
            <Card
              type="inner"
              title="Pickup Location"
              style={{ marginBottom: 16 }}
            >
              <Form.Item
                label="Latitude"
                name="pickupLat"
                rules={[
                  { required: true, message: "Please enter pickup latitude" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter latitude"
                  step={0.000001}
                  precision={6}
                />
              </Form.Item>

              <Form.Item
                label="Longitude"
                name="pickupLng"
                rules={[
                  { required: true, message: "Please enter pickup longitude" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter longitude"
                  step={0.000001}
                  precision={6}
                />
              </Form.Item>
            </Card>
          </Col>

          {/* Drop-off Location */}
          <Col span={12}>
            <Card
              type="inner"
              title="Drop-off Location"
              style={{ marginBottom: 16 }}
            >
              <Form.Item
                label="Latitude"
                name="dropOffLat"
                rules={[
                  { required: true, message: "Please enter drop-off latitude" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter latitude"
                  step={0.000001}
                  precision={6}
                />
              </Form.Item>

              <Form.Item
                label="Longitude"
                name="dropOffLng"
                rules={[
                  {
                    required: true,
                    message: "Please enter drop-off longitude",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter longitude"
                  step={0.000001}
                  precision={6}
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        {/* Price */}
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter the price" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Enter price"
            min={0}
            precision={2}
            prefix={<DollarOutlined />}
          />
        </Form.Item>

        {/* Date */}
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select a date" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>

        {/* Vehicle Type */}
        <Form.Item
          label="Vehicle Type"
          name="vehicleType"
          rules={[{ required: true, message: "Please select a vehicle type" }]}
        >
          <Select placeholder="Select vehicle type">
            <Option value="Car">Car</Option>
            <Option value="Scooter">Scooter</Option>
            <Option value="Bus">Bus</Option>
          </Select>
        </Form.Item>

        {/* Notes */}
        <Form.Item
          label="Notes"
          name="notes"
          rules={[{ required: true, message: "Please enter notes" }]}
        >
          <TextArea rows={4} placeholder="Enter any additional notes" />
        </Form.Item>

        {/* Is Active */}
        <Form.Item
          label="Active Status"
          name="isActive"
          valuePropName="checked"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        

        {/* Form Actions */}
        <Form.Item>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={() => form.resetFields()}>Reset</Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateTransportation;
