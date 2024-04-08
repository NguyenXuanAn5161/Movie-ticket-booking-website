import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Space,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import React from "react";

const defaultStartDate = dayjs().startOf("day").add(1, "day");

const Schedule = ({ form }) => {
  return (
    <Form
      //   labelCol={{
      //     span: 6,
      //   }}
      //   wrapperCol={{
      //     span: 18,
      //   }}
      form={form}
      name="dynamic_form_complex"
      autoComplete="off"
      initialValues={{
        items: [{}],
      }}
    >
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <>
                <Row gutter={[16]}>
                  <Col span={8}>
                    <Form.Item
                      labelCol={{ span: 24 }}
                      label="Chọn rạp"
                      name={[field.name, "cinemaId"]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      labelCol={{ span: 24 }}
                      label="Chọn phòng"
                      name={[field.name, "roomId"]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      labelCol={{ span: 24 }}
                      label="Chọn phim"
                      name={[field.name, "movieId"]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Lịch chiếu">
                  <Form.List name={[field.name, "list"]}>
                    {(subFields, subOpt) => (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 16,
                        }}
                      >
                        <Button
                          type="dashed"
                          onClick={() => subOpt.add()}
                          block
                        >
                          + thêm lịch chiếu
                        </Button>
                        {subFields.map((subField) => (
                          <Space key={subField.key} style={{ width: "100%" }}>
                            <Row
                              gutter={[16]}
                              //   style={{ backgroundColor: "red" }}
                            >
                              <Col span={6}>
                                <Form.Item
                                  noStyle
                                  name={[subField.name, "Ngày chiếu"]}
                                >
                                  <DatePicker
                                    minDate={defaultStartDate}
                                    defaultValue={defaultStartDate}
                                    style={{ width: "100%" }}
                                    format="DD-MM-YYYY"
                                    placeholder="Ngày chiếu"
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  noStyle
                                  name={[subField.name, "Giờ chiếu"]}
                                >
                                  <TimePicker placeholder="Giờ chiếu" />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  noStyle
                                  name={[subField.name, "Trạng thái"]}
                                  initialValue={true}
                                >
                                  <Radio.Group>
                                    <Radio value={true}>Hoạt động</Radio>
                                    <Radio value={false}>Ngưng hoạt động</Radio>
                                  </Radio.Group>
                                </Form.Item>
                              </Col>
                            </Row>
                            <CloseOutlined
                              onClick={() => {
                                subOpt.remove(subField.name);
                              }}
                            />
                          </Space>
                        ))}
                      </div>
                    )}
                  </Form.List>
                </Form.Item>
              </>
            ))}
          </>
        )}
      </Form.List>
    </Form>
  );
};
export default Schedule;
