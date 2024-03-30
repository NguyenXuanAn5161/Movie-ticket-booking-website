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
  Switch,
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

    // Chuyển đổi ảnh sang dạng binary
    const binaryData = await convertImageToBinary(imageFile[0]);
    formData.append("image", binaryData);
    console.log("formData:", binaryData);
    console.log("imageFile:", imageFile);
    // setLoading(false);

    return;
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

  const convertImageToBinary = (file) => {
    return new Promise((resolve, reject) => {
      if (!file || !(file instanceof Blob)) {
        reject(new Error("Invalid file object"));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="price" label="Price" rules={[{ required: true }]}>
        <InputNumber />
      </Form.Item>
      <Form.Item
        name="categoryId"
        label="Category"
        rules={[{ required: true }]}
      >
        <Select>
          <Option value={1}>Category 1</Option>
          <Option value={2}>Category 2</Option>
        </Select>
      </Form.Item>
      <Form.Item name="sizeFood" label="Size" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
        <InputNumber />
      </Form.Item>
      <Form.Item
        name="status"
        label="Status"
        valuePropName="checked"
        rules={[{ required: true }]}
      >
        <Switch />
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

// import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
// import {
//   Button,
//   Card,
//   Col,
//   Divider,
//   Form,
//   Input,
//   InputNumber,
//   Radio,
//   Row,
//   Select,
//   Upload,
//   message,
//   notification,
// } from "antd";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PageHeader from "../../../components/PageHeader/PageHeader";
// import {
//   callCreateFood,
//   callFetchListCategoryFood,
// } from "../../../services/apiMovie";
// import { getErrorMessageCategoryFood } from "../../../utils/errorHandling";

// // thay đổi #1
// const FoodCreate = () => {
//   // mặc định #2
//   const [isSubmit, setIsSubmit] = useState(false);
//   const [imageFile, setImageFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [foodCategory, setFoodCategory] = useState([]);

//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   // get category
//   useEffect(() => {
//     getCategoryFood();
//   }, []);

//   const getCategoryFood = async () => {
//     let query = `size=100`;
//     const res = await callFetchListCategoryFood(query);
//     if (res?.content) {
//       const d = res.content.map((item) => {
//         return { label: item.name, value: item.id };
//       });
//       setFoodCategory(d);
//     } else {
//       const error = getErrorMessageCategoryFood(res.response.data.message);
//       notification.error({
//         message: "Đã có lỗi xảy ra!",
//         description: error,
//       });
//     }
//   };

//   const onFinish = async (values) => {
//     // thay đổi #1
//     const { name, category_id, size, price, status } = values;
//     setIsSubmit(true);
//     // thay đổi #1 api call
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("categoryid", category_id);
//     formData.append("sizeFood", size);
//     formData.append("price", price);
//     formData.append("status", status);
//     formData.append("image", imageFile);

//     const res = await callCreateFood(formData);
//     console.log("res", res);
//     if (res?.status === 200) {
//       // thay đổi #1 message
//       message.success("Tạo mới đồ ăn thành công!");
//       form.resetFields();
//       setIsSubmit(false);
//       // thay đổi #1 thay đổi url
//       navigate("/admin/food");
//     } else {
//       notification.error({
//         message: "Đã có lỗi xảy ra!",
//         description: res.response.data.message,
//       });
//       setIsSubmit(false);
//     }
//   };

//   // xử lý hình ảnh
//   const normFile = (e) => {
//     if (Array.isArray(e)) {
//       return e;
//     }
//     setImageFile(e.file);
//     return e && e.fileList;
//   };

//   return (
//     <>
//       {/* // thay đổi #1 title */}
//       <PageHeader title="Tạo mới đồ ăn" numberBack={-1} type="create" />
//       <Divider />
//       {/* // thay đổi #1 title */}
//       <Card title="Tạo mới đồ ăn" bordered={false}>
//         <Form
//           form={form}
//           name="basic"
//           initialValues={{ remember: true }}
//           onFinish={onFinish}
//           autoComplete="true"
//           style={{ margin: "0 auto" }}
//         >
//           <Row gutter={[16]}>
//             <Form.Item
//               hidden
//               labelCol={{ span: 24 }}
//               label="Id đồ ăn"
//               name="id"
//             >
//               <Input />
//             </Form.Item>
//             <Col span={8}>
//               <Form.Item
//                 labelCol={{ span: 24 }}
//                 label="Tên đồ ăn"
//                 name="name"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng nhập tên đồ ăn!",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Nhập tên đồ ăn" />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item
//                 labelCol={{ span: 24 }}
//                 label="Giá"
//                 name="price"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng nhập giá!",
//                   },
//                 ]}
//               >
//                 <InputNumber
//                   formatter={(value) =>
//                     `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                   }
//                   min={1000}
//                   style={{ width: "100%" }}
//                   addonAfter={"VND"}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item
//                 labelCol={{ span: 24 }}
//                 label="Số lượng"
//                 name="quantity"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng nhập số lượng!",
//                   },
//                 ]}
//               >
//                 <InputNumber min={1} style={{ width: "100%" }} />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item
//                 labelCol={{ span: 24 }}
//                 label="Loại đồ ăn"
//                 name="category_id"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng nhập tên quốc gia sản xuất phim!",
//                   },
//                 ]}
//                 initialValue={1}
//               >
//                 <Select
//                   showSearch
//                   allowClear
//                   options={foodCategory}
//                   filterSort={(optionA, optionB) =>
//                     (optionA?.label ?? "")
//                       .toLowerCase()
//                       .localeCompare((optionB?.label ?? "").toLowerCase())
//                   }
//                   optionFilterProp="children"
//                   filterOption={(input, option) =>
//                     // Tìm kiếm không phân biệt hoa thường
//                     option.label.toLowerCase().includes(input.toLowerCase())
//                   }
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item
//                 labelCol={{ span: 24 }}
//                 label="Trạng thái"
//                 name="status"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng chọn trạng thái!",
//                   },
//                 ]}
//                 initialValue={true}
//               >
//                 <Radio.Group>
//                   <Radio value={true}>Còn hàng</Radio>
//                   <Radio value={false}>Hết hàng</Radio>
//                 </Radio.Group>
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item
//                 labelCol={{ span: 24 }}
//                 label="Kich cỡ"
//                 name="sizeFood"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng chọn size cho đồ ăn!",
//                   },
//                 ]}
//                 initialValue={"MEDIUM"}
//               >
//                 <Radio.Group>
//                   <Radio value="SMALL">Nhỏ</Radio>
//                   <Radio value="MEDIUM">Vừa</Radio>
//                   <Radio value="LARGE">Lớn</Radio>
//                 </Radio.Group>
//               </Form.Item>
//             </Col>
//             <Col span={24}>
//               <Form.Item
//                 labelCol={{ span: 24 }}
//                 label="Hình ảnh"
//                 name="image"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Vui lòng chọn hình ảnh!",
//                   },
//                 ]}
//               >
//                 <Upload
//                   accept="image/*"
//                   onChange={(info) => normFile(info)}
//                   fileList={imageFile ? [imageFile] : []}
//                   // listType="picture-card"
//                   // {...props}
//                   // beforeUpload={() => false} // return false so that antd doesn't upload the picture right away
//                 >
//                   <div>
//                     {loading ? <LoadingOutlined /> : <PlusOutlined />}
//                     <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
//                   </div>
//                 </Upload>
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row style={{ display: "flex", justifyContent: "flex-end" }}>
//             <Form.Item>
//               <Button type="primary" htmlType="submit" loading={isSubmit}>
//                 Tạo mới
//               </Button>
//             </Form.Item>
//           </Row>
//         </Form>
//       </Card>
//     </>
//   );
// };

// export default FoodCreate;
