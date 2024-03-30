// import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
// import {
//   Button,
//   Form,
//   Input,
//   InputNumber,
//   Select,
//   Switch,
//   Upload,
//   message,
// } from "antd";
// import axios from "axios";
// import { useState } from "react";

// const { Option } = Select;

// const FoodCreate = () => {
//   const [form] = Form.useForm();
//   const [imageFile, setImageFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const onFinish = async (values) => {
//     console.log("imageFile:", imageFile);
//     // return;
//     setLoading(true);
//     const formData = new FormData();
//     formData.append("name", values.name);
//     formData.append("price", values.price);
//     formData.append("categoryId", values.categoryId);
//     formData.append("sizeFood", values.sizeFood);
//     formData.append("quantity", values.quantity);
//     formData.append("status", values.status);
//     formData.append("image", imageFile);

//     try {
//       const response = await axios.post(
//         "http://localhost:8080/api/food",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       console.log("Create food success:", response.data);
//       message.success("Create food success");
//       form.resetFields();
//     } catch (error) {
//       console.error("Error creating food:", error);
//       message.error("Error creating food");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const normFile = (e) => {
//     if (Array.isArray(e)) {
//       return e;
//     }
//     setImageFile(e.file);
//     return e && e.fileList;
//   };

//   return (
//     <Form form={form} onFinish={onFinish}>
//       <Form.Item name="name" label="Name" rules={[{ required: true }]}>
//         <Input />
//       </Form.Item>
//       <Form.Item name="price" label="Price" rules={[{ required: true }]}>
//         <InputNumber />
//       </Form.Item>
//       <Form.Item
//         name="categoryId"
//         label="Category"
//         rules={[{ required: true }]}
//       >
//         <Select>
//           <Option value={1}>Category 1</Option>
//           <Option value={2}>Category 2</Option>
//         </Select>
//       </Form.Item>
//       <Form.Item name="sizeFood" label="Size" rules={[{ required: true }]}>
//         <Input />
//       </Form.Item>
//       <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
//         <InputNumber />
//       </Form.Item>
//       <Form.Item
//         name="status"
//         label="Status"
//         valuePropName="checked"
//         rules={[{ required: true }]}
//       >
//         <Switch />
//       </Form.Item>
//       <Form.Item name="image" label="Image" rules={[{ required: true }]}>
//         <Upload
//           accept="image/*"
//           beforeUpload={() => false}
//           onChange={(info) => normFile(info)}
//           fileList={imageFile ? [imageFile] : []}
//           listType="picture-card"
//         >
//           <div>
//             {loading ? <LoadingOutlined /> : <PlusOutlined />}
//             <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
//           </div>
//         </Upload>
//       </Form.Item>
//       <Form.Item>
//         <Button type="primary" htmlType="submit" loading={loading}>
//           Submit
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default FoodCreate;

import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
} from "antd";
import axios from "axios";
import { useState } from "react";

const { Option } = Select;

const FoodCreate = () => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    // setLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("categoryId", values.categoryId);
    formData.append("sizeFood", values.sizeFood);
    formData.append("quantity", values.quantity);
    formData.append("status", values.status);

    console.log("imageFile:", imageFile);
    // Chuyển đổi ảnh sang dạng binary
    // const binaryData = await convertImageToBinary(imageFile[0]);
    const base64 = await getBase64(imageFile[0].originFileObj, (url) => {
      return url;
    });
    formData.append("image", base64);
    // setLoading(false);

    // return;
    try {
      const response = await axios.post(
        "http://localhost:8080/api/food",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Create food success:", response.data);
      message.success("Create food success");
      form.resetFields();
    } catch (error) {
      console.error("Error creating food:", error);
      message.error("Error creating food");
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    setImageFile(e.fileList);
    return e && e.fileList;
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const convertImageToBinary = (info) => {
    if (info.file.status === "uploading") {
      type ? setLoadingSlider(true) : setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        type ? setLoadingSlider(false) : setLoading(false);
        setImageUrl(url);
      });
    }
  };

  // const convertImageToBinary = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsArrayBuffer(file);
  //     reader.onload = () => {
  //       resolve(reader.result);
  //     };
  //     reader.onerror = (error) => {
  //       reject(error);
  //     };
  //   });
  // };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true }]}
        initialValue={1}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true }]}
        initialValue={1}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        name="categoryId"
        label="Category"
        rules={[{ required: true }]}
        initialValue={1}
      >
        <Select>
          <Option value={1}>Category 1</Option>
          <Option value={2}>Category 2</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="sizeFood"
        label="Size"
        rules={[{ required: true }]}
        initialValue={"M"}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="quantity"
        label="Quantity"
        rules={[{ required: true }]}
        initialValue={1}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        name="status"
        label="Status"
        valuePropName="checked"
        rules={[{ required: true }]}
        initialValue={true}
      >
        <Input />
      </Form.Item>
      <Form.Item name="image" label="Image" rules={[{ required: true }]}>
        <Upload
          maxCount={1}
          accept="image/*"
          beforeUpload={() => false}
          onChange={(info) => normFile(info)}
          fileList={imageFile}
          listType="picture-card"
        >
          <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
          </div>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FoodCreate;
