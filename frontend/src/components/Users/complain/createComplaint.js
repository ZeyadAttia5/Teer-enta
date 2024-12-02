// import React, { useState } from "react";
// import { Modal, Button, Input, Form } from "antd";
// import { addComplaint } from "../../../api/complaint.ts";

// const { TextArea } = Input;

// const CreateComplaint = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [form] = Form.useForm();

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const onFinish = async (values) => {
//     const data = {
//       ...values,
//     };

//     try {
//       const response = await addComplaint(data);
//       console.log("Response: ", response);
//       form.resetFields(); // Reset form fields
//     } catch (error) {
//       console.error("There was an error submitting the complaint: ", error);
//     }

//     closeModal();
//   };

//   return (
//     <div className="p-4">
//       <Button type="primary" onClick={openModal} className="mb-4">
//         Create Complaint
//       </Button>

//       <Modal
//         title="Create Complaint"
//         visible={isModalOpen}
//         onCancel={closeModal}
//         footer={null}
//       >
//         <Form layout="vertical" onFinish={onFinish} form={form}>
//           <Form.Item
//             label="Title"
//             name="title"
//             rules={[{ required: true, message: "Please input the title!" }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="Description"
//             name="description"
//             rules={[
//               { required: true, message: "Please input the description!" },
//             ]}
//           >
//             <TextArea rows={4} />
//           </Form.Item>
//           <Form.Item
//             label="Body"
//             name="body"
//             rules={[{ required: true, message: "Please input the body!" }]}
//           >
//             <TextArea rows={6} />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Submit
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default CreateComplaint;

// Modified code with the modal always visible
import React, { useState } from "react";
import { Modal, Button, Input, Form } from "antd";
import { addComplaint } from "../../../api/complaint.ts";

const { TextArea } = Input;

const CreateComplaint = (isOpen) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [form] = Form.useForm();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    const data = {
      ...values,
    };

    try {
      const response = await addComplaint(data);
      // console.log("Response: ", response);
      form.resetFields(); // Reset form fields
    } catch (error) {
      console.error("There was an error submitting the complaint: ", error);
    }

    closeModal();
  };

  return (
    <div className="p-4">
      <Modal
        title="Create Complaint"
        visible={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Body"
            name="body"
            rules={[{ required: true, message: "Please input the body!" }]}
          >
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateComplaint;
