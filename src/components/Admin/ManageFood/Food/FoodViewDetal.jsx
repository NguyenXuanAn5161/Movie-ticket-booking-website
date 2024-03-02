import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Badge, Descriptions, Divider, Drawer, Modal, Tag, Upload } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FORMAT_DATE_DISPLAY } from "../../../../utils/constant";

const FoodViewDetail = (props) => {
  const {
    openViewDetail,
    dataViewDetail,
    setOpenViewDetail,
    setDataViewDetail,
  } = props;

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (dataViewDetail) {
      let imgThumbnail = {},
        imgSlider = [];
      if (dataViewDetail.thumbnail) {
        imgThumbnail = {
          uid: uuidv4(),
          name: dataViewDetail.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataViewDetail.thumbnail
          }`,
        };
      }

      if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
        dataViewDetail.slider.map((item) => {
          imgSlider.push({
            uid: uuidv4(),
            name: item,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          });
        });
      }

      setFileList([imgThumbnail, ...imgSlider]);
    }
  }, [dataViewDetail]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleCancel = () => setPreviewOpen(false);

  return (
    <>
      <Drawer
        title={
          <span>
            Chi tiết{" "}
            <span style={{ color: "blue" }}>{dataViewDetail?.mainText}</span>
          </span>
        }
        width={"50vw"}
        onClose={onClose}
        open={openViewDetail}
      >
        <Descriptions title="Thông tin đồ ăn" bordered column={2}>
          <Descriptions.Item label="Id">
            {dataViewDetail?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Tên đồ ăn">
            {dataViewDetail?.mainText}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {dataViewDetail?.author && (
              <Tag
                color={dataViewDetail.author.length > 10 ? "success" : "error"}
                icon={
                  dataViewDetail.author.length > 10 ? (
                    <CheckCircleOutlined />
                  ) : (
                    <CloseCircleOutlined />
                  )
                }
              >
                {dataViewDetail.author.length > 10 ? "Còn" : "Hết"}
              </Tag>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Giá tiền">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(dataViewDetail?.price ?? 0)}
          </Descriptions.Item>
          <Descriptions.Item label="Số lượng">
            {dataViewDetail?.quantity}
          </Descriptions.Item>
          <Descriptions.Item label="Đã bán">
            {dataViewDetail?.sold}
          </Descriptions.Item>
          <Descriptions.Item label="Thể loại" span={2}>
            <Badge status="processing" text={dataViewDetail?.category} />
          </Descriptions.Item>
          <Descriptions.Item label="Tạo ngày">
            {moment(dataViewDetail?.createdAt).format(FORMAT_DATE_DISPLAY)}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật ngày">
            {moment(dataViewDetail?.updatedAt).format("DD-MM-YYYY HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
        <Divider orientation="left">Ảnh đồ ăn</Divider>
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={{ showRemoveIcon: false }}
        />
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Drawer>
    </>
  );
};

export default FoodViewDetail;
